import 'dotenv/config';
import { Settings, VectorStoreIndex, Document } from 'llamaindex';
import { OpenAI, OpenAIEmbedding } from '@llamaindex/openai';

Settings.llm = new OpenAI({ model: "gpt-4o-mini" });
Settings.embedModel = new OpenAIEmbedding({ model: "text-embedding-3-small" });

async function test() {
    const doc = new Document({ text: "Hello world" });
    const index = await VectorStoreIndex.fromDocuments([doc]);
    
    const queryEngine = index.asQueryEngine({
        nodePostprocessors: [{
            postprocessNodes: async (nodes, query) => {
                console.log("nodes length:", nodes.length);
                console.log("query type:", typeof query, query);
                return nodes;
            }
        }]
    });
    
    await queryEngine.query({ query: "Hello?" });
}
test().catch(console.error);
