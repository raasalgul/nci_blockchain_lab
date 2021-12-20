# nci_blockchain_ERC20_SKK

## Install NodeJs ##

We can get NodeJs from the following link:

```https://nodejs.org/en/download/```


## Install GitHub ##
 
```https://github.com/git-guides/install-git```


## Install Docker ##
 
```https://www.docker.com/products/docker-desktop```


## Git setup ##

To checkout the code from git run this comment

```git clone https://github.com/raasalgul/nci_blockchain_lab.git ```

## To execute the code through Node JS ##

Locate the code in terminal by using change directory command (If needed)

``` cd <code checkout location>/nci_blockchain_lab ```

To download all node dependencies we must run the following comment inside the terminal

```  npm install ```

To start the server we must run the handler.js file

``` node handler.js ```

## To execute the code through Docker Container ##

To create the docker image, be in the same directory of the docker file (If needed)

``` cd <code checkout location>/nci_blockchain_lab ```

The command to create the docker image 

```docker build -t nci/skk3.0 ```

The command to run the docker in the container

``` docker run -p 8090:8080 --name skk3.0 -d nci/skk3.0 ```

The command to stop the container

```docker stop skk3.0```

The command to start the container

```docker start skk3.0```

The command to view logs in the container

```docker logs skk3.0 -f```

The command to list all the images

```docker image ls```

The command to list all the container running

```docker ps```

The command to remove all the docker images

```docker image prune -a -f```