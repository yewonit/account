import { Sequelize } from "sequelize"
import environment from "../config/environment.js"

const sequelize = new Sequelize(
	environment.DB_NAME,
	environment.DB_USER,
	environment.DB_PASSWORD,
	{
		host: environment.DB_HOST,
		dialect: "mysql",
	}
)

const initDatabase = async () => {
	try {
		await sequelize.authenticate()
		console.log("데이터베이스 연결 성공")

		await sequelize.query("SET FOREIGN_KEY_CHECKS = 0")
		await sequelize.sync({ force: false })
		await sequelize.query("SET FOREIGN_KEY_CHECKS = 1")

		console.log("데이터베이스 동기화 완료")
	} catch (error) {
		console.log("데이터베이스 초기화 실패", {
			error: error.message,
			stack: error.stack,
		})
		throw error
	}
}

export { initDatabase, sequelize }
