# Blog-API
# Docker
You need docker desktop installed first
#
# To run Docker and build image
(Terminal): docker compose -d up --build
#
# Stop and delete docker container (compose)
Terminal: docker compose down
#
# to start it again after build
Terminal : docker compose up -d
#
# Set up You're own .env file:
mongo_url
redis_url
jwt_secret
email-password-for-nodemailer
