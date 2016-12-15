# MOSAIQ
## Server  
- `server.js` serves whole news data as an object if requested `GET` `/news`.  
- `crawler.js` scrapes news of the day and save as `<date>.json` file and MySQL.  
  - MySQL: 'news' table in 'MOSAIQ' database  
  - colums of 'news' table  
  
    | Field     | Type        | Null | Key | Default | Extra          |
    |-----------|-------------|------|-----|---------|----------------|
    | news_id   | INT(11)     | NO   | PRI | NULL    | AUTO_INCREMENT |
    | date      | DATE        | NO   |     | NULL    |                |
    | publisher | VARCHAR(20) | NO   |     | NULL    |                |
    | headline  | TINYTEXT    | YES  |     | NULL    |                |
    | body      | MEDIUMTEXT  | YES  |     | NULL    |                |
    | img       | TEXT        | YES  |     | NULL    |                |
    | link      | TINYTEXT    | NO   |     | NULL    |                |
    | type      | VARCHAR(10) | YES  |     | NULL    |                |

- `autoCrawler.js` acts just as `crawler.js` except that it automatically scrapes articles every 5 a.m.  
- `plainText.js` removes tags from articles and count their words  
- `clientModel.js` shows how to request data to the server.  
  - the server returns the array of objects.  
  - **data form**  
    [  
       {  
         date:\<date\>,  
         publisher:\<publisher\>,  
         type:\<type of article\>,  
         headline:\<article headline\>,  
         body:\<article body\>,  
         img:\<list of images\>,  
         length:\<length of the body\>  
       },  
      ...  
    ]    
- `plainText.js` reads rows with `type` from MySQL MOSAIQ database.  
  Then, it makes file `file.csv` of the data for machine learning.  

### How to update Server  
1. ssh login to AmazonAWS  
2. `git pull` in `~/workspace/MOSAIQ`  
3. `npm run build` in `~/workspace/MOSAIQ`  
4. when the build is done,  
   `sudo cp -rf ~/workspace/MOSAIQ/build/* /var/www/html/`  
5. now we have to stop server.js.  
   `forever list` to see the pid of server.js run by background process.  
6. `forever stop <pid of server.js>` to stop the process.  
7. `forever start server.js <MySQL password>` to start the process.  
