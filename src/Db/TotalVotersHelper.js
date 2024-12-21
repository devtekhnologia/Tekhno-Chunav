import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';

const database_name = "voterDatabase.db";

// Open the database connection
export const connectToDatabase = async () => {
    return await SQLite.openDatabaseAsync(database_name);
}

export const closeDatabase = async () => {
    const db = await connectToDatabase();
    db.closeAsync();
    console.log("DB closed");
}


export const createTotalVotersTable = async () => {
    try {
        const db = await connectToDatabase()
        await db.execAsync("PRAGMA journal_mode = WAL;");
        // id INTEGER PRIMARY KEY AUTOINCREMENT,

        const statement1 = await db.prepareAsync(`
                        CREATE TABLE IF NOT EXISTS tbl_voter (
                        voter_id INTEGER PRIMARY KEY AUTOINCREMENT ,
                        voter_name TEXT DEFAULT NULL,
                        voter_parent_name TEXT DEFAULT NULL,
                        voter_house_number TEXT DEFAULT NULL,
                        voter_age TEXT DEFAULT NULL,
                        voter_gender TEXT DEFAULT NULL,
                        voter_town_id INTEGER DEFAULT NULL,
                        voter_booth_id INTEGER DEFAULT NULL,
                        voter_contact_number INTEGER DEFAULT NULL,
                        voter_cast_id INTEGER DEFAULT NULL,
                        voter_religion_id INTEGER DEFAULT NULL,
                        voter_favour_id INTEGER DEFAULT NULL,
                        voter_constituency_id INTEGER DEFAULT NULL,
                        voter_dob TEXT DEFAULT NULL,
                        voter_marital_status_id INTEGER DEFAULT NULL,
                        voter_updated_by INTEGER DEFAULT NULL,
                        voter_updated_date TEXT DEFAULT NULL,
                        voter_live_status_id TEXT DEFAULT NULL,
                        voter_dead_year INTEGER DEFAULT NULL,
                        voter_vote_confirmation_id INTEGER DEFAULT NULL,
                        voter_group_id INTEGER DEFAULT NULL,
                        voter_in_city_id INTEGER DEFAULT NULL,
                        voter_current_location TEXT DEFAULT NULL,
                        voter_name_mar TEXT DEFAULT NULL,
                        voter_voter_group_id INTEGER DEFAULT NULL
                    );
                `);

        const statement2 = await db.prepareAsync(`
                        CREATE TABLE IF NOT EXISTS tbl_voter (
                        voter_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        voter_name TEXT DEFAULT NULL,
                        voter_name_mar TEXT DEFAULT NULL,
                        voter_serial_number INTEGER DEFAULT NULL,   
                        voter_id_card_number TEXT DEFAULT NULL,
                        booth_id INTEGER DEFAULT NULL,
                        booth_name TEXT DEFAULT NULL,
                        booth_name_mar TEXT DEFAULT NULL,
                        town_name TEXT DEFAULT NULL,
                        town_name_mar TEXT DEFAULT NULL
                    );
                `);

        await statement2.executeAsync();

        // await statement1.executeAsync();
        console.log("Total Voters Table created successfully");

    } catch (error) {
        console.error('Error creating table or querying:', error);
    }
};

export const insertVoterInTotalVotersTable = async (voter) => {
    const db = await connectToDatabase();
    // console.log("Voter :: ", voter);
    // console.log("DB :: ", db);


    try {
        // const query = `INSERT INTO tbl_voter (voter_id, voter_name, voter_name_mar, voter_serial_number,
        //     booth_id, booth_name, booth_name_mar)`;

        const result = db.runSync(`INSERT INTO tbl_voter (voter_id, voter_name, voter_name_mar,voter_serial_number,
            voter_id_card_number,booth_id, booth_name, booth_name_mar, town_name, town_name_mar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            voter.voter_id, voter.voter_name, voter.voter_name_mar, voter.voter_serial_number, voter.voter_id_card_number,
            voter.booth_id, voter.booth_name, voter.booth_name_mar, voter.town_name, voter.town_name_mar);
        console.log("Result :: ", result.lastInsertRowId);
        await AsyncStorage.setItem('WashimTablelastInsertedRowId', result.lastInsertRowId.toString());
    } catch (error) {
        console.error('Error storing voter details in local storage:', error);
        Alert.alert('Error', `Failed to store voter details in local storage: ${error.message} `);
    }
};

export const insertWashimTotalVoter = async (result) => {
    console.log("Result length :: ", result.length);

    const lastVoter = await AsyncStorage.getItem('WashimTablelastInsertedRowId');
    console.log("Last voter :: ", lastVoter);

    let startIndex = 0;
    const CHUNK_SIZE = 5000;

    if (lastVoter) {
        startIndex = result.findIndex(voter => voter.voter_id === parseInt(lastVoter)) + 1;
        console.log("Start index :: ", startIndex);
    }

    const insertVotersInChunks = async () => {
        try {
            const insertPromises = [];

            for (let i = startIndex; i < result.length; i += CHUNK_SIZE) {
                const chunk = result.slice(i, i + CHUNK_SIZE);

                console.log("Chunk :: ", chunk[0].voter_id);
                await new Promise(resolve => setTimeout(resolve, 5000));

                insertPromises.push(
                    ...chunk.map(voter => insertVoterInTotalVotersTable(voter))
                );

                if (insertPromises.length >= 1000) {
                    await Promise.all(insertPromises);
                    insertPromises.length = 0;

                    console.log(`${i + 1} batch inserted, pausing for 5 seconds...`);
                    await new Promise(resolve => setTimeout(resolve, 5000));
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

export const getLastVoterFromTotalVotersTable = async () => {
    const db = await connectToDatabase();
    // console.log("DB :: ", db);

    try {
        const statement2 = db.prepareSync('SELECT * FROM tbl_voter ORDER BY voter_id DESC LIMIT 1');
        const statement1 = db.prepareSync('SELECT last_insert_rowid()');
        const result2 = await statement2.executeAsync();
        console.log("Result2 :: ", result2.lastInsertRowId);
        const lastInsertRowId = result2.lastInsertRowId;
        return lastInsertRowId;
    } catch (error) {
        console.error('Error fetching voters:', error);
        Alert.alert('Error', 'Failed to fetch voters. Please try again.');
        return null;
    }
};

export const getBoothVotersFromDatabase = async (boothId) => {
    try {
        console.log("Booth ID :: ", boothId);
        
        const db = await connectToDatabase()
        console.log("DB :: ", db);
        
        const statement2 = await db.prepareAsync(`SELECT * FROM tbl_voter WHERE booth_id = ?;`, [boothId]);
        const result2 = await statement2.executeAsync();
        const allRows = await result2.getAllAsync();
        console.log("allRows :: ", allRows);

        return allRows;
    } catch (error) {
        console.error('Error fetching voters:', error);
        Alert.alert('Error', 'Failed to fetch voters. Please try again.');
    }
}

export const getVotersFromTotalVotersTable = async () => {
    try {
        const db = await connectToDatabase()
        const statement2 = await db.prepareAsync('SELECT * FROM tbl_voter');
        const result2 = await statement2.executeAsync();
        const allRows = await result2.getAllAsync();
        return allRows;
    } catch (error) {
        console.error('Error fetching voters:', error);
        Alert.alert('Error', 'Failed to fetch voters. Please try again.');
    }
}

export const dropTotalVotersTable = async () => {
    try {
        const db = await connectToDatabase()
        AsyncStorage.setItem('WashimTablelastInsertedRowId', "0");
        await db.execAsync("DROP TABLE IF EXISTS tbl_voter;");
    } catch (error) {
        console.error('Error dropping table:', error);
    }
}