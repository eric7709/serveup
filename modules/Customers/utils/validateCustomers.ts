export function validateCustomerForm(form: {
  name: string;
  phone?: string;
  email: string;
  title: string;
}): string | null {
  const { name, phone, email, title } = form;
  if (!name || !email || !title || !phone) {
    return "All fields are required.";
  }
  if (!email.includes("@")) {
    return "Please enter a valid email.";
  }

  return null;
}
