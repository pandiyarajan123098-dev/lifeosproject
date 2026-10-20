-- =============================================================================
-- LifeOS Database Schema for Microsoft SQL Server (SSMS 20 Compatible)
-- Database: CSE9909
-- Server: 103.207.1.91
-- Non-destructive: Checks IF OBJECT_ID is NULL before creating any table or index.
-- Does NOT drop or modify any existing tables in the database.
-- =============================================================================

USE [CSE9909];
GO

-- 1. LifeOSUsers Table
IF OBJECT_ID(N'dbo.LifeOSUsers', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.LifeOSUsers (
        id INT IDENTITY(1,1) PRIMARY KEY,
        full_name NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) NOT NULL CONSTRAINT UQ_LifeOSUsers_Email UNIQUE,
        password_hash NVARCHAR(255) NOT NULL,
        created_at DATETIME2 NOT NULL CONSTRAINT DF_LifeOSUsers_CreatedAt DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL CONSTRAINT DF_LifeOSUsers_UpdatedAt DEFAULT SYSUTCDATETIME()
    );
    CREATE NONCLUSTERED INDEX IX_LifeOSUsers_Email ON dbo.LifeOSUsers(email);
    PRINT 'Created table: LifeOSUsers';
END
ELSE
BEGIN
    PRINT 'Table LifeOSUsers already exists. Skipping.';
END
GO

-- 2. LifeOSProfiles Table
IF OBJECT_ID(N'dbo.LifeOSProfiles', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.LifeOSProfiles (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL CONSTRAINT FK_LifeOSProfiles_User FOREIGN KEY REFERENCES dbo.LifeOSUsers(id) ON DELETE CASCADE,
        first_name NVARCHAR(100) NULL,
        last_name NVARCHAR(100) NULL,
        age INT NULL,
        occupation NVARCHAR(255) NULL,
        skill_level NVARCHAR(50) NULL, -- 'Beginner', 'Intermediate', 'Advanced'
        primary_goal NVARCHAR(500) NULL,
        secondary_goal NVARCHAR(500) NULL,
        daily_available_minutes INT NOT NULL CONSTRAINT DF_LifeOSProfiles_Minutes DEFAULT 60,
        learning_style NVARCHAR(50) NULL, -- 'Reading', 'Video', 'Hands-on Projects', 'Mixed'
        target_date DATE NULL,
        preferred_task_count INT NOT NULL CONSTRAINT DF_LifeOSProfiles_TaskCount DEFAULT 4,
        onboarding_completed BIT NOT NULL CONSTRAINT DF_LifeOSProfiles_Onboarding DEFAULT 0,
        created_at DATETIME2 NOT NULL CONSTRAINT DF_LifeOSProfiles_CreatedAt DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL CONSTRAINT DF_LifeOSProfiles_UpdatedAt DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_LifeOSProfiles_UserId UNIQUE (user_id)
    );
    CREATE NONCLUSTERED INDEX IX_LifeOSProfiles_UserId ON dbo.LifeOSProfiles(user_id);
    PRINT 'Created table: LifeOSProfiles';
END
ELSE
BEGIN
    PRINT 'Table LifeOSProfiles already exists. Skipping.';
END
GO

-- 3. LifeOSInterests Table
IF OBJECT_ID(N'dbo.LifeOSInterests', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.LifeOSInterests (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL CONSTRAINT FK_LifeOSInterests_User FOREIGN KEY REFERENCES dbo.LifeOSUsers(id) ON DELETE CASCADE,
        interest_name NVARCHAR(100) NOT NULL
    );
    CREATE NONCLUSTERED INDEX IX_LifeOSInterests_UserId ON dbo.LifeOSInterests(user_id);
    PRINT 'Created table: LifeOSInterests';
END
ELSE
BEGIN
    PRINT 'Table LifeOSInterests already exists. Skipping.';
END
GO

-- 4. LifeOSSkills Table
IF OBJECT_ID(N'dbo.LifeOSSkills', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.LifeOSSkills (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL CONSTRAINT FK_LifeOSSkills_User FOREIGN KEY REFERENCES dbo.LifeOSUsers(id) ON DELETE CASCADE,
        skill_name NVARCHAR(100) NOT NULL,
        proficiency_level NVARCHAR(50) NOT NULL CONSTRAINT DF_LifeOSSkills_Proficiency DEFAULT 'Beginner'
    );
    CREATE NONCLUSTERED INDEX IX_LifeOSSkills_UserId ON dbo.LifeOSSkills(user_id);
    PRINT 'Created table: LifeOSSkills';
END
ELSE
BEGIN
    PRINT 'Table LifeOSSkills already exists. Skipping.';
END
GO

-- 5. LifeOSTasks Table
IF OBJECT_ID(N'dbo.LifeOSTasks', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.LifeOSTasks (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL CONSTRAINT FK_LifeOSTasks_User FOREIGN KEY REFERENCES dbo.LifeOSUsers(id) ON DELETE CASCADE,
        task_title NVARCHAR(255) NOT NULL,
        task_description NVARCHAR(MAX) NULL,
        category NVARCHAR(100) NOT NULL,
        estimated_minutes INT NOT NULL CONSTRAINT DF_LifeOSTasks_Minutes DEFAULT 15,
        priority NVARCHAR(50) NOT NULL CONSTRAINT DF_LifeOSTasks_Priority DEFAULT 'Medium', -- 'High', 'Medium', 'Low'
        task_date DATE NOT NULL,
        is_completed BIT NOT NULL CONSTRAINT DF_LifeOSTasks_IsCompleted DEFAULT 0,
        completed_at DATETIME2 NULL,
        created_at DATETIME2 NOT NULL CONSTRAINT DF_LifeOSTasks_CreatedAt DEFAULT SYSUTCDATETIME()
    );
    CREATE NONCLUSTERED INDEX IX_LifeOSTasks_User_Date ON dbo.LifeOSTasks(user_id, task_date);
    PRINT 'Created table: LifeOSTasks';
END
ELSE
BEGIN
    PRINT 'Table LifeOSTasks already exists. Skipping.';
END
GO

-- 6. LifeOSDailyProgress Table
IF OBJECT_ID(N'dbo.LifeOSDailyProgress', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.LifeOSDailyProgress (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL CONSTRAINT FK_LifeOSDailyProgress_User FOREIGN KEY REFERENCES dbo.LifeOSUsers(id) ON DELETE CASCADE,
        progress_date DATE NOT NULL,
        total_tasks INT NOT NULL CONSTRAINT DF_LifeOSDailyProgress_Total DEFAULT 0,
        completed_tasks INT NOT NULL CONSTRAINT DF_LifeOSDailyProgress_Completed DEFAULT 0,
        completion_percentage DECIMAL(5,2) NOT NULL CONSTRAINT DF_LifeOSDailyProgress_Pct DEFAULT 0.00,
        submitted_at DATETIME2 NOT NULL CONSTRAINT DF_LifeOSDailyProgress_Submitted DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_LifeOSDailyProgress_User_Date UNIQUE (user_id, progress_date)
    );
    CREATE NONCLUSTERED INDEX IX_LifeOSDailyProgress_User_Date ON dbo.LifeOSDailyProgress(user_id, progress_date);
    PRINT 'Created table: LifeOSDailyProgress';
END
ELSE
BEGIN
    PRINT 'Table LifeOSDailyProgress already exists. Skipping.';
END
GO
