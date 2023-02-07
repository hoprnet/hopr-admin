# hopr-admin
HOPR Admin app which can be used to manage a HOPRd node via its API


## Run docker image


````
docker run -d --name hoprd_admin -p 3000:3000 gcr.io/hoprassociation/hopr-admin:latest
````

## Run locallly

````
yarn && yarn build && yarn start
````

# Debugging
````
yarn && yarn dev
````
