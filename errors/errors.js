const handler = (err, req, res, next) => {
	console.error("Unhandled error:", err)

	res.status(err.status || 500).json({
		error: {
			message: err.message || "Internal Server Error",
		},
	})
}

export default handler
