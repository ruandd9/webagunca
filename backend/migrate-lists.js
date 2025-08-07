const mongoose = require('mongoose');
const List = require('./models/List');
const dotenv = require('dotenv');

// Configurar variáveis de ambiente
dotenv.config();

// Conectar ao MongoDB usando a mesma URI do servidor
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function migrateLists() {
    try {
        console.log('Iniciando migração de listas...');
        
        // Buscar todas as listas que não têm listId
        const listsWithoutListId = await List.find({ listId: { $exists: false } });
        console.log(`Encontradas ${listsWithoutListId.length} listas sem listId`);
        
        for (const list of listsWithoutListId) {
            // Gerar listId a partir do nome
            const listId = list.name.toLowerCase().replace(/\s+/g, '-');
            
            // Atualizar a lista
            await List.findByIdAndUpdate(list._id, { listId });
            console.log(`Lista "${list.name}" atualizada com listId: ${listId}`);
        }
        
        console.log('Migração concluída com sucesso!');
        
        // Verificar se todas as listas agora têm listId
        const allLists = await List.find();
        console.log(`Total de listas: ${allLists.length}`);
        
        for (const list of allLists) {
            console.log(`Lista: "${list.name}" - listId: "${list.listId}"`);
        }
        
    } catch (error) {
        console.error('Erro durante a migração:', error);
    } finally {
        mongoose.connection.close();
    }
}

migrateLists(); 