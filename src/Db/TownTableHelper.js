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
    db.closeSync();
    console.log("DB closed");

}


export const createTownsTable = async () => {
    try {
        const db = await connectToDatabase()
        await db.execAsync("PRAGMA journal_mode = WAL;");
        const statement1 = await db.prepareAsync(`
                        CREATE TABLE IF NOT EXISTS tbl_towns (
                        town_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        town_name TEXT DEFAULT NULL,
                        town_panchayat_samiti_id INTEGER DEFAULT NULL,
                        town_panchayat_samiti_circle_id INTEGER DEFAULT NULL,
                        town_area_type_id INTEGER DEFAULT NULL,
                        town_name_mar TEXT DEFAULT NULL
                    );
                `);

        await statement1.executeAsync();
        console.log("Towns Table created successfully");

    } catch (error) {
        console.error('Error creating table or querying:', error);
    }
};


export const insertTown = async (town) => {
    const db = await connectToDatabase();
    console.log("Towns :: ", town);
    console.log("DB :: ", db);

    try {
        let insertQuery = "INSERT INTO tbl_towns (town_id, town_name, town_name_mar) VALUES (?, ?, ?)";
        let result = db.runSync(insertQuery, town.town_id, town.town_name, town.town_name_mar);
        console.log("Result :: ", result.lastInsertRowId);
    } catch (error) {
        console.error('Error storing town details:', error);
        Alert.alert('Error', `Failed to store town details: ${error.message}`);
    }
};


export const getLastTownFromDatabase = async () => {
    try {
        const db = await connectToDatabase()
        const statement2 = await db.prepareAsync('SELECT * FROM tbl_towns ORDER BY voter_id DESC LIMIT 1');
        const result2 = await statement2.executeAsync();
        const lastInsertRowId = result2.lastInsertRowId;
        return lastInsertRowId;
    } catch (error) {
        console.error('Error fetching voters:', error);
        Alert.alert('Error', 'Failed to fetch voters. Please try again.');
    }
}


export const getAllTowns = async () => {
    try {
        const db = await connectToDatabase()
        const statement2 = await db.prepareAsync('SELECT * FROM tbl_towns');
        const result2 = await statement2.executeAsync();
        const allRows = await result2.getAllAsync();
        return allRows;
    } catch (error) {
        console.error('Error fetching voters:', error);
        Alert.alert('Error', 'Failed to fetch voters. Please try again.');
    }
}

export const dropTownsTable = async () => {
    try {
        const db = await connectToDatabase()
        await db.execAsync("DROP TABLE IF EXISTS tbl_towns;");
    } catch (error) {
        console.error('Error dropping table:', error);
    }
}