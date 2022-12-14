#!/bin/bash
#
# This script creates the models + migrations for the backend

# User model
npx sequelize model:create --name User --attributes firstName:string,lastName:string,email:string,username:string,passwordHash:string

# Spot model
npx sequelize model:create --name Spot --attributes ownerId:integer,address:string,city:string,state:string,country:string,lat:numeric,lng:numeric,name:string,description:string,price:numeric

# SpotImage model
npx sequelize model:create --name SpotImage --attributes spotId:integer,url:string,preview:boolean

# Review model
npx sequelize model:create --name Review --attributes userId:integer,spotId:integer,review:string,stars:integer

# ReviewImage model
npx sequelize model:create --name ReviewImage --attributes reviewId:integer,url:string

# Booking model
npx sequelize model:create --name Booking --attributes spotId:integer,userId:integer,startDate:date,endDate:date
