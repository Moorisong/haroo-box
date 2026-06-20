import fs from 'fs';
import 'dotenv/config'; // .env 파일에서 환경변수 로드
import { Settings, VectorStoreIndex, storageContextFromDefaults } from 'llamaindex';
import { SimpleDirectoryReader } from '@llamaindex/readers/directory';
import { OpenAI, OpenAIEmbedding } from '@llamaindex/openai';

// [수정 포인트 0] OpenAI LLM 및 Embedding 모델 전역 설정 (LlamaIndex v0.12+ 필수 사항)
Settings.llm = new OpenAI({ model: "gpt-4o-mini" });
Settings.embedModel = new OpenAIEmbedding({ model: "text-embedding-3-small" });

const PERSIST_DIR = "./storage";

// RAG를 위해 central_docs(project_docs) 및 실제 코드 디렉토리 경로 추가
const DATA_PATHS = [
    "../project_docs", 
    "../apps/server/src", 
    "../apps/web/app", 
    "../apps/web/components", 
    "../apps/web/lib"
]; 

// [추가] LLM 기반 정밀 리랭커 (NodePostprocessor)
class LLMReranker {
    constructor(topN = 5) {
        this.topN = topN;
    }
    
    async postprocessNodes(nodes, query) {
        if (nodes.length === 0) return nodes;
        
        console.log(`\n⚖️  [Reranking] 1차로 검색된 ${nodes.length}개의 문서를 LLM으로 정밀 평가하여 핵심 문서 ${this.topN}개를 선별합니다...`);
        
        // 토큰 절약을 위해 각 문서 텍스트를 일부만 사용
        const contextStr = nodes.map((n, i) => `[문서 ID: ${i}]\n${n.node.text.substring(0, 400)}...`).join("\n\n");
        
        const prompt = `당신은 검색 정확도를 높이는 문서 평가자입니다. 다음 질문에 대답하기 위해 아래 제공된 문서들 중 가장 관련성 높은 문서 ID를 최대 ${this.topN}개만 순서대로 콤마로 구분하여 숫자만 반환하세요. 어떤 부가 설명도 하지 마세요.
질문: ${query}

문서들:
${contextStr}

가장 관련성 높은 문서 ID (예: 2,5,1):`;

        try {
            const response = await Settings.llm.complete({ prompt });
            const resultText = response.text.trim();
            console.log(`🎯 [Reranking 완료] AI가 판단한 핵심 문서 ID: ${resultText}`);
            
            const selectedIds = resultText.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
            const rerankedNodes = selectedIds.map(id => nodes[id]).filter(n => n !== undefined);
            
            if (rerankedNodes.length > 0) {
                return rerankedNodes;
            }
        } catch (e) {
            console.error("Reranking 중 오류 발생:", e);
        }
        
        return nodes.slice(0, this.topN); // fallback
    }
}

async function runRagExperiment() {
    console.log("🚀 [1/3] Node.js 실험실 RAG 파이프라인 가동 시작...");
    
    let index;

    // 만약 기존에 저장된 창고가 없다면 처음부터 인덱싱합니다.
    if (!fs.existsSync(PERSIST_DIR)) {
        console.log("📦 기존 창고가 없네요. 새롭게 인덱싱을 시작합니다. (비용 최초 1회 발생)");
        
        const reader = new SimpleDirectoryReader();
        let documents = [];
        
        // 지정한 폴더들을 돌면서 문서와 코드를 싹 긁어모읍니다.
        for (const path of DATA_PATHS) {
            if (fs.existsSync(path)) {
                const docs = await reader.loadData({ directoryPath: path });
                documents = documents.concat(docs);
            } else {
                console.log(`⚠️ 경고: ${path} 경로를 찾을 수 없습니다. 경로를 다시 확인하세요!`);
            }
        }
        
        // 이미지 파일들은 텍스트 전용 벡터 스토어에 들어갈 수 없으므로 필터링합니다.
        documents = documents.filter(doc => doc.constructor.name !== "ImageDocument");
        
        // 🌟 [추가] 각 문서의 파일 경로를 바탕으로 '어떤 서비스의 문서인지' 동적으로 알아내어 메타데이터 꼬리표 달기
        documents.forEach(doc => {
            const filePath = doc.metadata?.file_path || "";
            let serviceTag = "common"; // 기본값
            
            // project_docs/서비스명 또는 apps/서비스명 형태에서 폴더명을 자동으로 추출합니다.
            const match = filePath.match(/(?:project_docs|apps)\/([^\/]+)/);
            if (match && match[1]) {
                serviceTag = match[1];
                // haroo-box는 중앙 지침서이므로 명확하게 표기
                if (serviceTag === "haroo-box") {
                    serviceTag = "haroo-box (Central)";
                }
            }

            // AI가 헷갈리지 않도록 텍스트 앞부분에 메타데이터를 직접 박아줍니다.
            doc.text = `[Service Context: ${serviceTag}]\n` + doc.text;
            doc.metadata.service_name = serviceTag;
        });

        console.log(`📚 총 ${documents.length}개의 텍스트/코드 조각에 메타데이터 꼬리표 부착 완료!`);
        
        // 로컬 파일시스템(storage)에 저장하기 위한 StorageContext 생성
        const storageContext = await storageContextFromDefaults({ persistDir: PERSIST_DIR });
        
        // OpenAI를 사용해 벡터 창고(Index)를 빌드하고 로컬에 자동 저장합니다.
        index = await VectorStoreIndex.fromDocuments(documents, { storageContext });
        
        console.log(`💾 인덱싱 완료! '${PERSIST_DIR}' 폴더에 안전하게 저장되었습니다.`);
    } else {
        // 이미 저장된 창고가 있다면 OpenAI를 호출하지 않고 로컬 파일을 재사용합니다 (공짜!).
        console.log("♻️ 기존에 빌드된 로컬 창고를 재사용합니다. (API 비용 절약!)");
        const storageContext = await storageContextFromDefaults({ persistDir: PERSIST_DIR });
        index = await VectorStoreIndex.init({ storageContext });
    }

    // 4. AI에게 질문을 던질 엔진 가동
    // 전체 문서를 더 폭넓게 분석할 수 있도록 가져올 유사 문서의 수(similarityTopK)를 30으로 늘리고,
    // 커스텀 LLMReranker를 통해 그 중 가장 중요한 10개의 핵심 문맥만 걸러서 AI에게 주입합니다.
    const queryEngine = index.asQueryEngine({ 
        similarityTopK: 30,
        nodePostprocessors: [new LLMReranker(10)]
    });    
    // 5. 면접관들이 환장하는 교차 검증 질문 던지기 (프롬프트 고도화)
    const testQuery = `
당신은 깐깐한 수석 시스템 아키텍트입니다. 전체 문서를 바탕으로 다음을 명확하고 단호하게 평가하여 보고서를 작성하세요:
1. [Service Context: haroo-box (Central)]에 명시된 '중앙 대원칙(공통 지침)'들을 정확히 나열할 것.
2. htsm과 u-know 서비스가 이 중앙 대원칙들을 하나라도 위반하거나 어긋나게 구현한 내용이 문서나 코드상에 존재하는지 샅샅이 찾아보고, 위반 사항이 있다면 '경고'로, 없다면 '통과'로 명확히 판정할 것.
3. Rate Limit이나 보안 규칙처럼 개별 서비스의 특성에 맞춰 다르게 적용된 고유 정책은 위반이 아니므로 판정에서 제외할 것.
`;
    console.log(`\n🔍 [2/3] AI 비서에게 더 확실해진 질문 던지는 중...\n👉 "${testQuery.trim()}"`);
    
    const response = await queryEngine.query({ query: testQuery });
    
    console.log("\n======================= 🤖 AI 분석 결과 보고서 =======================");
    console.log(response.toString());
    console.log("====================================================================\n");
    console.log("🏁 [3/3] 실험 종료! 성공!");
}

runRagExperiment().catch(console.error);