-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "flightCode" TEXT NOT NULL,
    "passengerNames" TEXT NOT NULL,
    "luggageCount" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "voucherNumber" TEXT NOT NULL,
    "driverFee" REAL,
    "driverId" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnTransferId" TEXT,
    "isReturn" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Reservation_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Reservation_returnTransferId_fkey" FOREIGN KEY ("returnTransferId") REFERENCES "Reservation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Reservation" ("createdAt", "currency", "date", "driverFee", "driverId", "flightCode", "from", "id", "luggageCount", "passengerNames", "paymentStatus", "phoneNumber", "price", "time", "to", "voucherNumber") SELECT "createdAt", "currency", "date", "driverFee", "driverId", "flightCode", "from", "id", "luggageCount", "passengerNames", "paymentStatus", "phoneNumber", "price", "time", "to", "voucherNumber" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
CREATE UNIQUE INDEX "Reservation_voucherNumber_key" ON "Reservation"("voucherNumber");
CREATE UNIQUE INDEX "Reservation_returnTransferId_key" ON "Reservation"("returnTransferId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
