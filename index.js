const express = require("express");
const bodyParser = require("body-parser");
const {
  User,
  Resource,
  DocumentTransaction,
  DID,
  Document,
} = require("./models/index");
require("dotenv").config();
const setupSwagger = require("./swagger");
const authenticateJWT = require("./middleware/auth");

const app = express();
app.use(bodyParser.json());

// Swagger setup
setupSwagger(app);

// CRUD Operations for Resources
/**
 * @swagger
 * components:
 *   schemas:
 *     Resource:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the resource
 *         name:
 *           type: string
 *           description: The name of the resource
 *       example:
 *         id: 1
 *         name: Sample Resource
 */

/**
 * @swagger
 * tags:
 *   name: Resources
 *   description: Resource management
 */

/**
 * @swagger
 * /resources:
 *   post:
 *     summary: Create a new resource
 *     tags: [Resources]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resource'
 *     responses:
 *       201:
 *         description: The resource was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       400:
 *         description: Bad request
 */
app.post("/resources", authenticateJWT, async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /resources:
 *   get:
 *     summary: Returns the list of all the resources
 *     tags: [Resources]
 *     responses:
 *       200:
 *         description: The list of the resources
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Resource'
 *       500:
 *         description: Some server error
 */
app.get("/resources", authenticateJWT, async (req, res) => {
  try {
    const resources = await Resource.findAll();
    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /resources/{id}:
 *   get:
 *     summary: Get a resource by id
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The resource id
 *     responses:
 *       200:
 *         description: The resource description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       404:
 *         description: Resource not found
 */
app.get("/resources/:id", authenticateJWT, async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (resource) {
      res.status(200).json(resource);
    } else {
      res.status(404).json({ error: "Resource not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /resources/{id}:
 *   put:
 *     summary: Update a resource by id
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The resource id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resource'
 *     responses:
 *       200:
 *         description: The resource was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       404:
 *         description: Resource not found
 *       400:
 *         description: Bad request
 */
app.put("/resources/:id", authenticateJWT, async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (resource) {
      await resource.update(req.body);
      res.status(200).json(resource);
    } else {
      res.status(404).json({ error: "Resource not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /resources/{id}:
 *   delete:
 *     summary: Delete a resource by id
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The resource id
 *     responses:
 *       204:
 *         description: The resource was deleted
 *       404:
 *         description: Resource not found
 */
app.delete("/resources/:id", authenticateJWT, async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (resource) {
      await resource.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Resource not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD Operations for Users
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *       example:
 *         id: 1
 *         name: John Doe
 *         email: john.doe@example.com
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */
app.post("/users", authenticateJWT, async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
app.get("/users", authenticateJWT, async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
app.get("/users/:id", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */
app.put("/users/:id", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.update(req.body);
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     responses:
 *       204:
 *         description: The user was deleted
 *       404:
 *         description: User not found
 */
app.delete("/users/:id", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD Operations for DIDs
/**
 * @swagger
 * components:
 *   schemas:
 *     DID:
 *       type: object
 *       required:
 *         - identifier
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the DID
 *         identifier:
 *           type: string
 *           description: The identifier of the DID
 *       example:
 *         id: 1
 *         identifier: did:example:123456
 */

/**
 * @swagger
 * tags:
 *   name: DIDs
 *   description: DID management
 */

/**
 * @swagger
 * /dids:
 *   post:
 *     summary: Create a new DID
 *     tags: [DIDs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DID'
 *     responses:
 *       201:
 *         description: The DID was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DID'
 *       400:
 *         description: Bad request
 */
app.post("/dids", authenticateJWT, async (req, res) => {
  try {
    const did = await DID.create(req.body);
    res.status(201).json(did);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /dids:
 *   get:
 *     summary: Returns the list of all the DIDs
 *     tags: [DIDs]
 *     responses:
 *       200:
 *         description: The list of the DIDs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DID'
 *       500:
 *         description: Some server error
 */
app.get("/dids", authenticateJWT, async (req, res) => {
  try {
    const dids = await DID.findAll();
    res.status(200).json(dids);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /dids/{id}:
 *   get:
 *     summary: Get a DID by id
 *     tags: [DIDs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The DID id
 *     responses:
 *       200:
 *         description: The DID description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DID'
 *       404:
 *         description: DID not found
 */
app.get("/dids/:id", authenticateJWT, async (req, res) => {
  try {
    const did = await DID.findByPk(req.params.id);
    if (did) {
      res.status(200).json(did);
    } else {
      res.status(404).json({ error: "DID not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /dids/{id}:
 *   put:
 *     summary: Update a DID by id
 *     tags: [DIDs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The DID id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DID'
 *     responses:
 *       200:
 *         description: The DID was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DID'
 *       404:
 *         description: DID not found
 *       400:
 *         description: Bad request
 */
app.put("/dids/:id", authenticateJWT, async (req, res) => {
  try {
    const did = await DID.findByPk(req.params.id);
    if (did) {
      await did.update(req.body);
      res.status(200).json(did);
    } else {
      res.status(404).json({ error: "DID not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /dids/{id}:
 *   delete:
 *     summary: Delete a DID by id
 *     tags: [DIDs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The DID id
 *     responses:
 *       204:
 *         description: The DID was deleted
 *       404:
 *         description: DID not found
 */
app.delete("/dids/:id", authenticateJWT, async (req, res) => {
  try {
    const did = await DID.findByPk(req.params.id);
    if (did) {
      await did.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "DID not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD Operations for Documents
/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the document
 *         title:
 *           type: string
 *           description: The title of the document
 *       example:
 *         id: 1
 *         title: Sample Document
 */

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Document management
 */

/**
 * @swagger
 * /documents:
 *   post:
 *     summary: Create a new document
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Document'
 *     responses:
 *       201:
 *         description: The document was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       400:
 *         description: Bad request
 */
app.post("/documents", authenticateJWT, async (req, res) => {
  try {
    const document = await Document.create(req.body);
    res.status(201).json(document);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /documents:
 *   get:
 *     summary: Returns the list of all the documents
 *     tags: [Documents]
 *     responses:
 *       200:
 *         description: The list of the documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 *       500:
 *         description: Some server error
 */
app.get("/documents", authenticateJWT, async (req, res) => {
  try {
    const documents = await Document.findAll();
    res.status(200).json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /documents/{id}:
 *   get:
 *     summary: Get a document by id
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The document id
 *     responses:
 *       200:
 *         description: The document description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       404:
 *         description: Document not found
 */
app.get("/documents/:id", authenticateJWT, async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (document) {
      res.status(200).json(document);
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /documents/{id}:
 *   put:
 *     summary: Update a document by id
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The document id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Document'
 *     responses:
 *       200:
 *         description: The document was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       404:
 *         description: Document not found
 *       400:
 *         description: Bad request
 */
app.put("/documents/:id", authenticateJWT, async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (document) {
      await document.update(req.body);
      res.status(200).json(document);
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /documents/{id}:
 *   delete:
 *     summary: Delete a document by id
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The document id
 *     responses:
 *       204:
 *         description: The document was deleted
 *       404:
 *         description: Document not found
 */
app.delete("/documents/:id", authenticateJWT, async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (document) {
      await document.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// CRUD Operations for DocumentTransactions
/**
 * @swagger
 * components:
 *   schemas:
 *     DocumentTransaction:
 *       type: object
 *       required:
 *         - documentId
 *         - userId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the document transaction
 *         documentId:
 *           type: integer
 *           description: The id of the document
 *         userId:
 *           type: integer
 *           description: The id of the user
 *       example:
 *         id: 1
 *         documentId: 1
 *         userId: 1
 */

/**
 * @swagger
 * tags:
 *   name: DocumentTransactions
 *   description: Document transaction management
 */

/**
 * @swagger
 * /documenttransactions:
 *   post:
 *     summary: Create a new document transaction
 *     tags: [DocumentTransactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DocumentTransaction'
 *     responses:
 *       201:
 *         description: The document transaction was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocumentTransaction'
 *       400:
 *         description: Bad request
 */
app.post("/documenttransactions", async (req, res) => {
  try {
    const transaction = await DocumentTransaction.create(req.body);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /documenttransactions:
 *   get:
 *     summary: Returns the list of all the document transactions
 *     tags: [DocumentTransactions]
 *     responses:
 *       200:
 *         description: The list of the document transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DocumentTransaction'
 *       500:
 *         description: Some server error
 */
app.get("/documenttransactions", async (req, res) => {
  try {
    const transactions = await DocumentTransaction.findAll();
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /documenttransactions/{id}:
 *   get:
 *     summary: Get a document transaction by id
 *     tags: [DocumentTransactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The document transaction id
 *     responses:
 *       200:
 *         description: The document transaction description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocumentTransaction'
 *       404:
 *         description: Document transaction not found
 */
app.get("/documenttransactions/:id", async (req, res) => {
  try {
    const transaction = await DocumentTransaction.findByPk(req.params.id);
    if (transaction) {
      res.status(200).json(transaction);
    } else {
      res.status(404).json({ error: "DocumentTransaction not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /documenttransactions/{id}:
 *   put:
 *     summary: Update a document transaction by id
 *     tags: [DocumentTransactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The document transaction id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DocumentTransaction'
 *     responses:
 *       200:
 *         description: The document transaction was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocumentTransaction'
 *       404:
 *         description: Document transaction not found
 *       400:
 *         description: Bad request
 */
app.put("/documenttransactions/:id", async (req, res) => {
  try {
    const transaction = await DocumentTransaction.findByPk(req.params.id);
    if (transaction) {
      await transaction.update(req.body);
      res.status(200).json(transaction);
    } else {
      res.status(404).json({ error: "DocumentTransaction not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /documenttransactions/{id}:
 *   delete:
 *     summary: Delete a document transaction by id
 *     tags: [DocumentTransactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The document transaction id
 *     responses:
 *       204:
 *         description: The document transaction was deleted
 *       404:
 *         description: Document transaction not found
 */
app.delete("/documenttransactions/:id", async (req, res) => {
  try {
    const transaction = await DocumentTransaction.findByPk(req.params.id);
    if (transaction) {
      await transaction.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "DocumentTransaction not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// JWT Authentication endpoints
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
