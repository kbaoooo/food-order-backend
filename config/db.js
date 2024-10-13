import mysql from "mysql2/promise";

class DB {
  constructor() {
    this.pool = mysql.createPool({
      host: "localhost",
      user: "root",
      database: "food-order",
      waitForConnections: true,
      connectionLimit: 10,  // Adjust based on your application's needs
      queueLimit: 0
    });
  }

  // Get a connection from the pool
  async getConnection() {
    try {
      const connection = await this.pool.getConnection();
      console.log("Database connected");

      return connection;
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      throw error;
    }
  }

  // Close all connections and end the pool
  async closePool() {
    try {
      await this.pool.end();
      console.log("Database connection pool closed");
    } catch (error) {
      console.error("Failed to close the database connection pool:", error);
    }
  }
}

export default new DB();
