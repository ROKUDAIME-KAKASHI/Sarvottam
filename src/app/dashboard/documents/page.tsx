import { getDocuments } from "@/app/actions/documents";
import DocumentsClient from "./DocumentsClient";

export default async function DocumentsPage() {
  const documents = await getDocuments();
  return <DocumentsClient documents={documents} />;
}
