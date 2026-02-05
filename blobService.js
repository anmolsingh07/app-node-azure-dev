const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } = require("@azure/storage-blob");
const connectionString = process.env.STORAGE_ACCOUNT_ANMOL_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

const STORAGE_ACCOUNT_ANMOL_NAME = process.env.STORAGE_ACCOUNT_ANMOL_NAME;
const STORAGE_ACCOUNT_ANMOL_KEY = process.env.STORAGE_ACCOUNT_ANMOL_KEY;

async function getImageUrl(containerName, blobName) {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    return blobClient.url;
}

async function getSasUrl(containerName, blobName) {
    const accountName = STORAGE_ACCOUNT_ANMOL_NAME;
    const accountKey = STORAGE_ACCOUNT_ANMOL_KEY;
    const sharedKeyCredential =
        new StorageSharedKeyCredential(accountName, accountKey);
    const sasToken = generateBlobSASQueryParameters(
        {
            containerName,
            blobName,
            permissions: BlobSASPermissions.parse("r"),
            expiresOn: new Date(Date.now() + 15 * 60 * 1000) // 15 mins
        },
        sharedKeyCredential
    ).toString();
    const img = await getImageUrl(containerName, blobName);
    return `${img}?${sasToken}`;
}

module.exports = { getSasUrl };