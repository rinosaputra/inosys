CREATE TABLE
  IF NOT EXISTS `_user_lists` (
    `id` varchar(36) NOT NULL,
    `fullName` varchar(255) NOT NULL,
    `emailAddress` varchar(255) NOT NULL,
    `emailVerified` boolean NOT NULL DEFAULT false,
    `image` text NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_user_lists_emailAddress` (`emailAddress`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE
  IF NOT EXISTS `_user_sessions` (
    `id` varchar(36) NOT NULL,
    `userId` varchar(36) NOT NULL,
    `token` text NOT NULL,
    `expiresAt` timestamp(3) NOT NULL,
    `ipAddress` text NULL,
    `userAgent` text NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_sessions_userId` (`userId`),
    CONSTRAINT `fk_user_sessions_userId` FOREIGN KEY (`userId`) REFERENCES `_user_lists` (`id`) ON DELETE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE
  IF NOT EXISTS `_user_accounts` (
    `id` varchar(36) NOT NULL,
    `userId` varchar(36) NOT NULL,
    `accountId` varchar(255) NOT NULL,
    `providerId` varchar(100) NOT NULL,
    `accessToken` text NULL,
    `refreshToken` text NULL,
    `accessTokenExpiresAt` timestamp(3) NULL,
    `refreshTokenExpiresAt` timestamp(3) NULL,
    `scope` text NULL,
    `idToken` text NULL,
    `password` text NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_accounts_userId` (`userId`),
    CONSTRAINT `fk_user_accounts_userId` FOREIGN KEY (`userId`) REFERENCES `_user_lists` (`id`) ON DELETE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE
  IF NOT EXISTS `_user_verifications` (
    `id` varchar(36) NOT NULL,
    `identifier` varchar(255) NOT NULL,
    `value` text NOT NULL,
    `expiresAt` timestamp(3) NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_verifications_identifier` (`identifier`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
