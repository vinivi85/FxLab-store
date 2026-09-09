import AdminProductsTable from "@/components/AdminProductsTable";

export const metadata = {
  title: "Admin — Products | FXlabs",
  robots: { index: false, follow: false },
};

export default function AdminProductsPage() {
  return <AdminProductsTable />;
}
