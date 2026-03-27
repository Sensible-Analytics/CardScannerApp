import * as RNFS from "react-native-fs";
import Share from "react-native-share";
import { Contact, ContactDraft, normalizeContactDraft } from "../types/contact";

export const exportContactAsVCard = async (
  contact: Contact | ContactDraft
): Promise<void> => {
  const normalizedContact = normalizeContactDraft(contact);

  try {
    const vCard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${normalizedContact.name};;;;`,
      `FN:${normalizedContact.name}`,
      normalizedContact.email ? `EMAIL:${normalizedContact.email}` : "",
      normalizedContact.phone ? `TEL:${normalizedContact.phone}` : "",
      normalizedContact.company ? `ORG:${normalizedContact.company}` : "",
      normalizedContact.address ? `ADR:${normalizedContact.address}` : "",
      normalizedContact.website ? `URL:${normalizedContact.website}` : "",
      "END:VCARD",
    ]
      .filter((line) => line !== "")
      .join("\n");

    const fileName = `${normalizedContact.name || "contact"}.vcf`.replace(
      /\s/g,
      "_"
    );
    const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    await RNFS.writeFile(filePath, vCard, "utf8");

    await Share.open({
      url: `file://${filePath}`,
      type: "text/vcard",
      title: "Share contact",
    });
  } catch (error) {
    console.warn("Failed to export contact:", error);
    throw error;
  }
};

export const exportContactsAsCSV = async (
  contacts: Contact[]
): Promise<void> => {
  try {
    const header = [
      "Name",
      "Email",
      "Phone",
      "Company",
      "Address",
      "Website",
      "Scanned At",
    ];
    const rows = contacts.map((contact) => [
      contact.name || "",
      contact.email || "",
      contact.phone || "",
      contact.company || "",
      contact.address || "",
      contact.website || "",
      contact.scannedAt || "",
    ]);

    const csvContent = [
      header.join(","),
      ...rows.map((row) =>
        row
          .map((field) => {
            const escaped = ("" + field).replace(/"/g, '""');
            return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
          })
          .join(",")
      ),
    ].join("\n");

    const fileName = "contacts.csv";
    const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    await RNFS.writeFile(filePath, csvContent, "utf8");

    await Share.open({
      url: `file://${filePath}`,
      type: "text/csv",
      title: "Share contacts",
    });
  } catch (error) {
    console.warn("Failed to export contacts:", error);
    throw error;
  }
};
