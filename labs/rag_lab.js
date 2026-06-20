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
        
        console.log(`📚 총 ${documents.length}개의 텍스트/코드 조각을 뇌에 넣을 준비 완료!`);
        
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
    const queryEngine = index.asQueryEngine();
    
    // 5. 면접관들이 환장하는 교차 검증 질문 던지기
    const testQuery = "중앙 지침서(central-docs)에 정의된 아키텍처 규칙이나 제약 조건이 실제 소스 코드 파일들에 잘 반영되어 있는지 검증하고, 모순점이 있다면 보고해줘.";
    console.log(`\n🔍 [2/3] AI 비서에게 질문 던지는 중...\n👉 "${testQuery}"`);
    
    const response = await queryEngine.query({ query: testQuery });
    
    console.log("\n======================= 🤖 AI 분석 결과 보고서 =======================");
    console.log(response.toString());
    console.log("====================================================================\n");
    console.log("🏁 [3/3] 실험 종료! 성공!");
}

runRagExperiment().catch(console.error);