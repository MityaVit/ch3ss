function hideEmail(email) {
  const [local, domain] = email.split("@");
  if (local.length <= 2) return email;
  return local[0] + "*".repeat(local.length - 2) + local.slice(-1) + "@" + domain;
}

export default {
    hideEmail
}