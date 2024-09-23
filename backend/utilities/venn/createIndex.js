const client = require("./localClient")

async function createIndex(indexName) {
    try {
      // Check if the index already exists
      const { body: exists } = await client.indices.exists({ index: indexName });
      
      if (exists) {
        console.log(`Index "${indexName}" already exists.`);
        return;
      }
  
      // Create the index
      const { body: response } = await client.indices.create({
        index: indexName
      });
  
      console.log(`Index "${indexName}" created successfully.`);
    } catch (error) {
      console.error(`Error creating index "${indexName}":`, error);
    }
  }
  
  // Example usage
  const indexName = 'venn_diagram';
  
  createIndex(indexName);