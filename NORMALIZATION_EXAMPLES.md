# Normalization API Examples

Here are clear, copy-pasteable example Request Body mappings for the Data Normalization endpoints. They all enforce your newly integrated AI configuration supporting `openrouter`.

> **Note**: These endpoints are protected. You need to provide a valid JWT `Authorization: Bearer <token>` in the Headers for these requests to succeed.

---

### 1. General Normalization Endpoint

**`POST /api/v1/normalize`**

For the generic endpoint, you **must** specify the `schemaType` you are targeting. Valid `schemaType` options are depending on `NormalizationSchemas` record in your application: `"product"`, `"event"`, `"contact"`, or `"professional_profile"`.

**JSON Request Body Example:**

```json
{
  "input": "Looking for the new Apple iPhone 15 Pro Max in Titanium Blue. It's $1199.",
  "schemaType": "product",
  "provider": "openrouter"
}
```

---

### 2. Specialized Profession Endpoint

**`POST /api/v1/normalize/profession`**

This endpoint automatically enforces the `professional_profile` schema behind the scenes, so **you don't need to specify `schemaType`**. This is used directly for parsing open-ended responses about a user's work/occupation.

**JSON Request Body Example:**

```json
{
  "input": "I am a Data Scientist analyzing financial models. I mainly use Python, Pandas, and SQL on a daily basis.",
  "provider": "openrouter"
}
```

---

### Understanding the response format

When a normalization endpoint works successfully, it returns:

```json
{
  "success": true,
  "data": {
    // ... Validated json following the underlying structure parameters
  },
  "message": "Input normalized successfully"
}
```
