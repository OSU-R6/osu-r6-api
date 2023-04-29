## Docker MySQL DB Creation
docker run --name osu-r6 -e MYSQL_ROOT_PASSWORD=password -d mysql


## User Account Generation
User accounts will only be able to be createed if that are provided a token from an administrator. This will prevent anyone from making an account. These tokens will be able to be creazted by admins on the site and stored in an 'invites' table in the database. Invites will be single use and mill be marked inactive after use. Using an invite token will also bind that account to that invite to create a log of which accounmt used which invite.