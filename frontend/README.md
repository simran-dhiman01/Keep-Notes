## Multi-Tenancy

This application implements multi-tenancy to support multiple tenants (companies) with strict isolation. The tenants included in this project are:

- **Acme**
- **Globex**

### Approach

We use a **shared schema with a `tenantId` column** approach:

- All users and notes are stored in a single database.
- Each `User` document has a `tenantId` field referencing the `Tenant` it belongs to.
- Each `Note` document also has a `tenantId` field.
- All API endpoints enforce tenant isolation by always filtering data by the `tenantId` of the authenticated user.
- This ensures that users from one tenant cannot access notes or users of another tenant.

### Why this approach?

- Simple to implement and maintain.
- Easy to scale with multiple tenants without creating multiple databases or schemas.
- Tenant isolation is enforced at the application level using the `tenantId` field.
