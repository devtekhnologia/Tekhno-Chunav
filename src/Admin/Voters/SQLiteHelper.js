import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';

const database_name = "voterDatabase.db";

// Open the database connection
export const connectToDatabase = async () => {
    return await SQLite.openDatabaseAsync(database_name);
}

export const closeDatabase = async () => {
    const db = await connectToDatabase();
    console.log("DB :: ", db);
    db.closeAsync();
    console.log("DB closed");

}


export const createTotalVotersBGTable = async () => {
    try {
        const db = await connectToDatabase()
        await db.execAsync("PRAGMA journal_mode = WAL;");
        const statement1 = await db.prepareAsync(`
                    CREATE TABLE IF NOT EXISTS totalvoters (
                        voter_id INTEGER PRIMARY KEY NOT NULL, 
                        voter_name TEXT NOT NULL, 
                        voter_name_mar TEXT NOT NULL
                    );
                `);

        const statement2 = await db.prepareAsync(`
                    CREATE TABLE IF NOT EXISTS totalvoters (
                        voter_id INTEGER PRIMARY KEY NOT NULL, 
                        voter_name TEXT , 
                        voter_name_mar TEXT 
                    );
                `);

        await statement1.executeAsync();
        console.log("Total Voters Table created successfully");

    } catch (error) {
        console.error('Error creating table or querying:', error);
    }
};

export const insertVoterInTotalBGTable = async (voter) => {
    const db = await connectToDatabase();
    console.log("Voter :: ", voter);
    console.log("DB :: ", db);


    try {
        const result = db.runSync('INSERT INTO totalvoters (voter_id, voter_name, voter_name_mar) VALUES (?, ?, ?)',
            voter.voter_id, voter.voter_name, voter.voter_name_mar);
        console.log("Result :: ", result.lastInsertRowId);

        // const result = db.runSync('INSERT INTO totalvoters (voter_id) VALUES (?)', voter_id);
        // console.log("Result :: ", result.lastInsertRowId);


        // // Assuming db is your database connection
        // const checkQuery = 'SELECT COUNT(*) AS count FROM totalvoters WHERE voter_id = ?';

        // const checkResult = db.getAllSync(checkQuery, voter.voter_id);

        // if (checkResult.count === 0) {
        //     // Data doesn't exist, so insert the new record
        //     const insertQuery = 'INSERT INTO totalvoters (voter_id, voter_name, voter_name_mar) VALUES (?, ?, ?)';
        //     const result = db.runSync(insertQuery, voter.voter_id, voter.voter_name, voter.voter_name_mar);
        //     console.log("Insert successful. Last Inserted Row ID: ", result.lastInsertRowId);
        // } else {
        //     // Data already exists
        //     console.log("Voter with this ID already exists.");
        // }


    } catch (error) {
        console.error('Error storing voter details:', error);
        Alert.alert('Error', `Failed to store voter details: ${error.message}`);
    }
};


export const insertTotalVoter = async (result) => {
    console.log("Result length :: ", result.length);

    const lastVoter = await getLastVoterFromDatabase();
    console.log("Last voter :: ", lastVoter);

    let startIndex = 0;

    if (lastVoter) {
        startIndex = result.findIndex(voter => voter.voter_id === lastVoter.voter_id) + 1;
    }

    console.log("Start index :: ", startIndex);

    const CHUNK_SIZE = 5000;
    const insertVotersInChunks = async () => {
        try {
            const insertPromises = [];

            for (let i = startIndex; i < result.length; i += CHUNK_SIZE) {
                const chunk = result.slice(i, i + CHUNK_SIZE);
                insertPromises.push(
                    ...chunk.map(voter => insertVoterInTotalBGTable(voter))
                );

                if (insertPromises.length >= 1000) {
                    await Promise.all(insertPromises);
                    insertPromises.length = 0;

                    // Add a 1-minute delay after the first batch
                    console.log(`${i + 1} batch inserted, pausing for 30 seconds...`);
                    await new Promise(resolve => setTimeout(resolve, 30000));
                    console.log('Resuming insertion...');
                }
            }

            if (insertPromises.length > 0) {
                await Promise.all(insertPromises);
            }
            console.log("All data inserted successfully");
        } catch (error) {
            console.error('Error inserting data:', error);
            Alert.alert('Error', 'Failed to insert data. Please try again.');
        }
    }

    await insertVotersInChunks();
}



export const getLastVoterFromDatabase = async () => {
    try {
        const db = await connectToDatabase()
        const statement2 = await db.prepareAsync('SELECT * FROM totalvoters ORDER BY voter_id DESC LIMIT 1');
        const result2 = await statement2.executeAsync();
        const lastInsertRowId = result2.lastInsertRowId;
        return lastInsertRowId;
    } catch (error) {
        console.error('Error fetching voters:', error);
        Alert.alert('Error', 'Failed to fetch voters. Please try again.');
    }
}


export const getVotersFromTotalVotersBGTable = async () => {
    try {
        const db = await connectToDatabase()
        const statement2 = await db.prepareAsync('SELECT * FROM totalvoters');
        const result2 = await statement2.executeAsync();
        const allRows = await result2.getAllAsync();
        return allRows;
    } catch (error) {
        console.error('Error fetching voters:', error);
        Alert.alert('Error', 'Failed to fetch voters. Please try again.');
    }
}

export const dropTotalVotersBGTable = async () => {
    try {
        const db = await connectToDatabase()
        await db.execAsync("DROP TABLE IF EXISTS totalvoters;");
    } catch (error) {
        console.error('Error dropping table:', error);
    }
}


// Create the table if it doesn't exist
export const createVotedVoterTable = async () => {
    try {
        const db = await connectToDatabase()
        await db.execAsync("PRAGMA journal_mode = WAL;");
        const statement1 = await db.prepareAsync(`
                    CREATE TABLE IF NOT EXISTS voter (
                        voter_id INTEGER PRIMARY KEY NOT NULL, 
                        voter_name TEXT NOT NULL, 
                        voter_name_mar TEXT NOT NULL
                    );
                `);

        await statement1.executeAsync();
        console.log("Voted Voters Table created successfully");

    } catch (error) {
        console.error('Error creating table or querying:', error);
    }
};


// Insert voter data into the table
export const insertVoterInVotedTable = async (voter) => {
    const db = await connectToDatabase()
    try {
        const result = db.runSync('INSERT INTO voter (voter_id, voter_name, voter_name_mar) VALUES (?, ?, ?)',
            voter.voter_id, voter.voter_name, voter.voter_name_mar);
    } catch (error) {
        console.error('Error storing voter details:', error);
        Alert.alert('Error', 'Failed to store voter details. Please try again.');
    }
};


// Fetch all voters from the table
export const getVotersFromVotedTable = async () => {
    try {
        const db = await connectToDatabase()
        const statement2 = await db.prepareAsync('SELECT * FROM voter');
        const result2 = await statement2.executeAsync();
        const allRows = await result2.getAllAsync();
        return allRows;
    } catch (error) {
        console.error('Error fetching voters:', error);
        Alert.alert('Error', 'Failed to fetch voters. Please try again.');
    }
};


export const dropVotedVoterTable = async () => {
    try {
        const db = await connectToDatabase()
        await db.execAsync("DROP TABLE IF EXISTS voter;");
    } catch (error) {
        console.error('Error dropping table:', error);
        Alert.alert('Error', 'Failed to drop table. Please try again.');
    }
};

