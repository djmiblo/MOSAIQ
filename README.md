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

- `autoCrawler.js` acts just as `crawler.js` except that it automatically scrapes articles every 5 a.m.  
- `plainText.js` removes tags from articles and count their words  
- `clientModel.js` shows how to request data to the server.  
  - the server returns the array of objects.  
  - **data form**  
    [{date:\<date\>, publisher:\<publisher\>, headline:\<article headline\>, body:\<article body\>}, img:\<list of images\>, length:\<length of the body\> ...]  
### How to update Server  
1. ssh login to AmazonAWS  
2. `git pull` in `~/workspace/MOSAIQ`  
3. `npm run build` in `~/workspace/MOSAIQ`  
4. when the build is done,  
   `sudo cp ~/workspace/MOSAIQ/build/* /var/www/html/`  
