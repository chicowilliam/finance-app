-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conta" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "vencimento" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,

    CONSTRAINT "Conta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Conta" ADD CONSTRAINT "Conta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
