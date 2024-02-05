ALTER TABLE `users` MODIFY COLUMN `avatar` text;
ALTER TABLE `users` DROP INDEX `users__workos_id__idx`;
ALTER TABLE `users` DROP COLUMN `workos_id`;