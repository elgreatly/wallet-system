import {MigrationInterface, QueryRunner} from "typeorm";

export class init1613222439306 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `phone-pay`.`user` ( \
            `id` INT(11) NOT NULL AUTO_INCREMENT , \
            `name` VARCHAR(225) NOT NULL , \
            `phone_number` VARCHAR(50) NOT NULL , \
            `password` VARCHAR(225) NOT NULL , \
            `wallet_balance` INT(11) NOT NULL , \
            PRIMARY KEY (`id`)) ENGINE = InnoDB;");

        await queryRunner.query("CREATE TABLE `phone-pay`.`wallet_transactions` ( \
            `id` INT(11) NOT NULL AUTO_INCREMENT , \
            `from_user_id` INT(11) NOT NULL , \
            `to_user_id` INT(11) NOT NULL , \
            `amount` INT(11) NOT NULL , \
            `currency` VARCHAR(10) NOT NULL DEFAULT 'USD' , \
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , \
            `is_active` BOOLEAN NOT NULL DEFAULT FALSE , \
            PRIMARY KEY (`id`)) ENGINE = InnoDB;");

        await queryRunner.query("ALTER TABLE `wallet_transactions` ADD CONSTRAINT `form_user_wallet_transaction` FOREIGN KEY (`from_user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;");

        await queryRunner.query("ALTER TABLE `wallet_transactions` ADD CONSTRAINT `to_user_wallet_transaction` FOREIGN KEY (`to_user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;");

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
