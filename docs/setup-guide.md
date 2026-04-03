# Setting up App Store Connect API Keys for ASC Doctor

ASC Doctor uses the **App Store Connect API** to audit your app's metadata. This guide walks you through creating an API key.

## Prerequisites

- An [Apple Developer Program](https://developer.apple.com/programs/) membership
- **Account Holder** or **Admin** role in App Store Connect

## Step 1: Navigate to API Keys

1. Sign in to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **Users and Access** in the top navigation
3. Select the **Integrations** tab
4. Click **App Store Connect API** in the left sidebar

## Step 2: Generate an API Key

1. Click the **"+"** button or **"Generate API Key"**
2. Enter a **name** for the key (e.g., "ASC Doctor Audit Key")
3. Select the **App Manager** role (minimum required)
4. Click **Generate**

> **Note:** ASC Doctor only performs read operations. While "App Manager" works, you can also use any role with read access to app metadata.

## Step 3: Download Your Key

1. Click **Download** next to the newly created key
2. Save the `.p8` file in a secure location
3. ⚠️ **Important:** You can only download this file **once**. If you lose it, you'll need to create a new key.

## Step 4: Note Your Credentials

From the API Keys page, note down:

- **Issuer ID** — Displayed at the top of the page (shared across all keys)
- **Key ID** — Displayed in the table next to your key name

## Step 5: Run ASC Doctor

```bash
ascdoc \
  --key-id YOUR_KEY_ID \
  --issuer-id YOUR_ISSUER_ID \
  --key /path/to/AuthKey_XXXXXXXX.p8
```

Or set up environment variables:

```bash
export ASC_KEY_ID=YOUR_KEY_ID
export ASC_ISSUER_ID=YOUR_ISSUER_ID
export ASC_KEY_PATH=/path/to/AuthKey_XXXXXXXX.p8

ascdoc
```

## Security Best Practices

- **Never** commit `.p8` files to version control
- Add `*.p8` to your `.gitignore`
- Use environment variables or a secrets manager in CI/CD
- Revoke unused API keys from App Store Connect
- Use the minimum required role (App Manager or read-only)

## Troubleshooting

### 401 NOT_AUTHORIZED

- Verify your Key ID and Issuer ID are correct
- Ensure the `.p8` file matches the Key ID
- Check that the key hasn't been revoked

### 403 FORBIDDEN

- Your API key role may not have sufficient permissions
- Ensure you have at least "App Manager" role

### "Multiple apps found"

- If your account has multiple apps, specify which one:
  ```bash
  ascdoc --app-id YOUR_APP_ID
  ```
- The error message will list all available apps with their IDs
