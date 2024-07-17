# TODO 
## Routes
#### Routes for user 

| Endpoint      | HTTP Method | Description   |
| ------------- | ----------- | ------------- |
| /user/        | POST        | Create a user |
| /user?page=<number of page>&size=<total data in a page>      | GET         | Get all users |
| /user/ :id    | GET         | Get a user    |
| /user/ :id    | PUT         | Update a user |
| /user/ :id    | DELETE      | Delete a user |

#### Routes for task

| Endpoint      | HTTP Method | Description   |
| ------------- | ----------- | ------------- |
| /task     | POST        | Create a task |
| /task     | GET         | Get all tasks |
| /task/:id | PUT         | Update a task |
| /task/:id | DELETE      | Delete a task |

## Install Dependencies

```bash
npm install
```

## Setup .env file

Create .env file with the help of .env.example to configure the port

## Run the server

```bash
npm start
```

#### Make sure database server is active

## OR

## Using on Docker
### Prerequisites
- Docker installed on the local machine. 

### Pulling docker image
```bash
docker pull safarajmanandhar/todo:latest
```
###  Creating container ,mapping  port 8000:8000, and running container in the background 
```bash
docker run -d -p 8000:8000 --name todo-container safarajmanandhar/todo:latest
```
### stoping container
```bash
docker stop todo-container
```
### removing container
```bash
docker rm todo-container
```
### removing image
```bash
docker rmi safarajmanandhar/todo:latest
```
