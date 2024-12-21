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


export const createBoothsTable = async () => {
    try {
        const db = await connectToDatabase()
        await db.execAsync("PRAGMA journal_mode = WAL;");
        const statement1 = await db.prepareAsync(`
                        CREATE TABLE IF NOT EXISTS tbl_booths (
                        booth_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        booth_name TEXT,
                        booth_town_id INTEGER DEFAULT NULL,
                        booth_prabhag_id INTEGER DEFAULT NULL,
                        booth_type_id INTEGER DEFAULT NULL,
                        booth_name_mar TEXT DEFAULT NULL,
                        tbl_booth_engcol TEXT DEFAULT NULL
                    );
                `);

        await statement1.executeAsync();
        console.log("Booths Table created successfully");
    } catch (error) {
        console.error('Error creating table or querying:', error);
    }
};


export const insertBooth = async (booth) => {
    const db = await connectToDatabase();
    console.log("Booths :: ", booth);
    console.log("DB :: ", db);

    try {
        let insertQuery = "INSERT INTO tbl_booths (booth_id, booth_name, booth_name_mar) VALUES (?, ?, ?)";
        let result = db.runSync(insertQuery, booth.booth_id, booth.booth_name, booth.booth_name_mar);
        console.log("Result :: ", result.lastInsertRowId);
    } catch (error) {
        console.error('Error storing booth details:', error);
        Alert.alert('Error', `Failed to store booth details: ${error.message}`);
    }
};


export const getLastTownFromDatabase = async () => {
    try {
        const db = await connectToDatabase()
        const statement2 = await db.prepareAsync('SELECT * FROM tbl_booths ORDER BY voter_id DESC LIMIT 1');
        const result2 = await statement2.executeAsync();
        const lastInsertRowId = result2.lastInsertRowId;
        return lastInsertRowId;
    } catch (error) {
        console.error('Error fetching voters:', error);
        Alert.alert('Error', 'Failed to fetch voters. Please try again.');
    }
}


export const getAllBooths = async () => {
    try {
        const db = await connectToDatabase()
        const statement2 = await db.prepareAsync('SELECT * FROM tbl_booths');
        const result2 = await statement2.executeAsync();
        const allRows = await result2.getAllAsync();
        return allRows;
    } catch (error) {
        console.error('Error fetching voters:', error);
        Alert.alert('Error', 'Failed to fetch voters. Please try again.');
    }
}

export const dropBoothsTable = async () => {
    try {
        const db = await connectToDatabase()
        await db.execAsync("DROP TABLE IF EXISTS tbl_booths;");
    } catch (error) {
        console.error('Error dropping table:', error);
    }
}