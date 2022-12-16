CREATE TABLE "Users" (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "firstName" varchar(20) NOT NULL,
    "lastName" varchar(20) NOT NULL,
    "email" varchar(30) UNIQUE NOT NULL,
    "username" varchar(18) UNIQUE NOT NULL,
    "passwordHash" char(64) NOT NULL,
    "createdAt" datetime DEFAULT (NOW()),
    "updatedAt" datetime DEFAULT (NOW())
);

CREATE TABLE "Spots" (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "ownerId" integer NOT NULL,
    "address" varchar NOT NULL,
    "city" varchar NOT NULL,
    "state" varchar NOT NULL,
    "country" varchar NOT NULL,
    "lat" numeric NOT NULL,
    "lng" numeric NOT NULL,
    "name" varchar(50) NOT NULL,
    "description" varchar NOT NULL,
    "price" numeric(0, 2) NOT NULL,
    "createdAt" datetime DEFAULT (NOW()),
    "updatedAt" datetime DEFAULT (NOW())
);

CREATE TABLE "SpotImages" (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "spotId" integer NOT NULL,
    "url" varchar NOT NULL,
    "preview" boolean NOT NULL DEFAULT 0,
    "createdAt" datetime DEFAULT (NOW()),
    "updatedAt" datetime DEFAULT (NOW())
);

CREATE TABLE "Reviews" (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "userId" integer NOT NULL,
    "spotId" integer NOT NULL,
    "review" varchar NOT NULL,
    "stars" integer NOT NULL,
    "createdAt" datetime DEFAULT (NOW()),
    "updatedAt" datetime DEFAULT (NOW())
);

CREATE TABLE "ReviewImages" (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "reviewId" integer NOT NULL,
    "url" varchar NOT NULL,
    "createdAt" datetime DEFAULT (NOW()),
    "updatedAt" datetime DEFAULT (NOW())
);

CREATE TABLE "Bookings" (
    "id" SERIAL PRIMARY KEY NOT NULL,
    "spotId" integer NOT NULL,
    "userId" integer NOT NULL,
    "startDate" date NOT NULL,
    "endDate" date NOT NULL,
    "createdAt" datetime DEFAULT (NOW()),
    "updatedAt" datetime DEFAULT (NOW()),
    CHECK ("endDate" > "startDate")
);

CREATE UNIQUE INDEX ON "Reviews" ("userId", "spotId");

CREATE UNIQUE INDEX ON "Bookings" ("spotId", "startDate");

CREATE UNIQUE INDEX ON "Bookings" ("spotId", "endDate");

ALTER TABLE
    "Spots"
ADD
    FOREIGN KEY ("ownerId") REFERENCES "Users" ("id") ON DELETE CASCADE;

ALTER TABLE
    "SpotImages"
ADD
    FOREIGN KEY ("spotId") REFERENCES "Spots" ("id") ON DELETE CASCADE;

ALTER TABLE
    "Reviews"
ADD
    FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE;

ALTER TABLE
    "Reviews"
ADD
    FOREIGN KEY ("spotId") REFERENCES "Spots" ("id") ON DELETE CASCADE;

ALTER TABLE
    "ReviewImages"
ADD
    FOREIGN KEY ("reviewId") REFERENCES "Reviews" ("id") ON DELETE CASCADE;

ALTER TABLE
    "Bookings"
ADD
    FOREIGN KEY ("spotId") REFERENCES "Spots" ("id") ON DELETE CASCADE;

ALTER TABLE
    "Bookings"
ADD
    FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE;
