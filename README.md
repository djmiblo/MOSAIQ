# MOSAIQ
## Server  
- `server.js` serves whole news data as an object if requested `GET` `/news`.  
- `crawler.js` scrapes news of the day and save as `<date>.json` file and MySQL.  
  + MySQL: 'news' table in 'MOSAIQ' database  
  + colums of 'news' table  
    * `news_id`: `INT(11)` `NOT NULL` `PRIMARY KEY` `AUTO_INCREMENT`  
    * `date`: `DATE` `NOT NULL`  
    * `publisher`: `VARCHAR(20)` `NOT NULL`  
    * `headline`: `TINYTEXT`  
    * `body`: `TEXT`  
    * `link`: `TINYTEXT` `NOT NULL`  
- `autoCrawler.js` acts just as `crawler.js` accept that it automatically scrapes articles every 5 a.m.  


mosaiq  

