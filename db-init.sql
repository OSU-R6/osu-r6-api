/* Insert Admin User */
INSERT INTO `OSU-R6`.`Users` (`name`, `email`, `password`, `admin`, `status`, `createdAt`, `updatedAt`) VALUES ('Admin User', 'admin@gmail.com', '$2b$08$bs0dshJaWfZgPWTydXBeRecTDdgjW0L1i2QXJHw7gx3p1YwDo.Qli', '1', 'active', '2023-04-29 01:09:56', '2023-04-29 01:09:56');
/* Insert Active User */
INSERT INTO `OSU-R6`.`Users` (`name`, `email`, `password`, `admin`, `status`, `createdAt`, `updatedAt`) VALUES ('Active User', 'active@gmail.com', '$2b$08$bs0dshJaWfZgPWTydXBeRecTDdgjW0L1i2QXJHw7gx3p1YwDo.Qli', '0', 'active', '2023-04-29 01:09:56', '2023-04-29 01:09:56');
/* Insert Inactive User */
INSERT INTO `OSU-R6`.`Users` (`name`, `email`, `password`, `admin`, `status`, `createdAt`, `updatedAt`) VALUES ('Inactive User', 'inactive@gmail.com', '$2b$08$bs0dshJaWfZgPWTydXBeRecTDdgjW0L1i2QXJHw7gx3p1YwDo.Qli', '0', 'inactive', '2023-04-29 01:09:56', '2023-04-29 01:09:56');