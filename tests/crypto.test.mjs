/**
 * 加密系统端到端测试
 * 运行方式: node tests/crypto.test.mjs
 * 无需任何测试框架依赖
 */
import { createCipheriv, createHmac, pbkdf2Sync } from "node:crypto";

// 从源文件复制的常量（必须与 crypto-utils.ts 保持同步）
const CRYPTO_CONSTANTS = {
	PBKDF2_ITERATIONS: 100000,
	SALT_LENGTH: 16,
	IV_LENGTH: 12,
	AUTH_TAG_LENGTH: 16,
	KEY_LENGTH: 32,
	VERIFY_PREFIX: "MIZUKI-VERIFY:",
};

// === 服务端加密（复刻 crypto-utils.ts） ===
function deriveBytes(key, context, length) {
	return createHmac("sha256", key).update(context).digest().subarray(0, length);
}

function encryptContent(html, password, slug) {
	const { PBKDF2_ITERATIONS, SALT_LENGTH, IV_LENGTH, KEY_LENGTH, VERIFY_PREFIX } = CRYPTO_CONSTANTS;
	const plaintext = VERIFY_PREFIX + html;
	const salt = deriveBytes(password, `salt:${slug}`, SALT_LENGTH);
	const iv = deriveBytes(password, `iv:${slug}`, IV_LENGTH);
	const key = pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, "sha256");
	const cipher = createCipheriv("aes-256-gcm", key, iv);
	const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
	const authTag = cipher.getAuthTag();
	return Buffer.concat([salt, iv, authTag, encrypted]).toString("base64");
}

// === 客户端解密（复刻 PasswordProtection.astro inline script） ===
async function clientDecrypt(encData, password) {
	const { PBKDF2_ITERATIONS, SALT_LENGTH, IV_LENGTH, AUTH_TAG_LENGTH, VERIFY_PREFIX } = CRYPTO_CONSTANTS;
	const raw = Buffer.from(encData, "base64");
	const salt = raw.subarray(0, SALT_LENGTH);
	const iv = raw.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
	const authTag = raw.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
	const ciphertext = raw.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);

	const combined = Buffer.concat([ciphertext, authTag]);

	const enc = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
	const aesKey = await crypto.subtle.deriveKey(
		{ name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
		keyMaterial, { name: "AES-GCM", length: 256 }, false, ["decrypt"],
	);
	const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, aesKey, combined);
	const decoded = new TextDecoder().decode(decrypted);

	if (!decoded.startsWith(VERIFY_PREFIX)) {
		throw new Error("Verification prefix mismatch");
	}
	return decoded.substring(VERIFY_PREFIX.length);
}

// === 测试用例 ===
const testHtml = "<h1>Hello World</h1><p>这是一篇加密文章的内容</p>";
const testPassword = "test-password-123";
const testSlug = "encrypted-test-post";

let passed = 0;
let failed = 0;

function assert(condition, message) {
	if (!condition) throw new Error(`Assertion failed: ${message}`);
}

async function test(name, fn) {
	try {
		await fn();
		console.log(`  ✓ ${name}`);
		passed++;
	} catch (err) {
		console.log(`  ✗ ${name}`);
		console.log(`    ${err.message}`);
		failed++;
	}
}

console.log("Encryption System Tests\n");

await test("encrypt and decrypt with correct password", async () => {
	const encrypted = encryptContent(testHtml, testPassword, testSlug);
	assert(encrypted.length > 0, "ciphertext should not be empty");
	const decrypted = await clientDecrypt(encrypted, testPassword);
	assert(decrypted === testHtml, `decrypted content mismatch: got "${decrypted.slice(0, 30)}..."`);
});

await test("deterministic ciphertext for same inputs", () => {
	const a = encryptContent(testHtml, testPassword, testSlug);
	const b = encryptContent(testHtml, testPassword, testSlug);
	assert(a === b, "same inputs should produce same ciphertext");
});

await test("reject wrong password", async () => {
	const encrypted = encryptContent(testHtml, testPassword, testSlug);
	let threw = false;
	try {
		await clientDecrypt(encrypted, "wrong-password");
	} catch {
		threw = true;
	}
	assert(threw, "wrong password should throw");
});

await test("different slugs produce different ciphertext", () => {
	const a = encryptContent(testHtml, testPassword, "slug-a");
	const b = encryptContent(testHtml, testPassword, "slug-b");
	assert(a !== b, "different slugs should produce different ciphertext");
});

await test("CJK content round-trip", async () => {
	const cjk = "<p>日本語テスト 中文测试 한국어 테스트</p>";
	const encrypted = encryptContent(cjk, testPassword, testSlug);
	const decrypted = await clientDecrypt(encrypted, testPassword);
	assert(decrypted === cjk, "CJK content mismatch");
});

await test("empty content round-trip", async () => {
	const encrypted = encryptContent("", testPassword, testSlug);
	const decrypted = await clientDecrypt(encrypted, testPassword);
	assert(decrypted === "", "empty content mismatch");
});

await test("special HTML characters round-trip", async () => {
	const special = '<div class="test">&amp; &lt; &gt; "quotes" \'single\'</div>';
	const encrypted = encryptContent(special, testPassword, testSlug);
	const decrypted = await clientDecrypt(encrypted, testPassword);
	assert(decrypted === special, "special HTML mismatch");
});

await test("CRYPTO_CONSTANTS have required fields", () => {
	assert(CRYPTO_CONSTANTS.PBKDF2_ITERATIONS === 100000, "PBKDF2_ITERATIONS");
	assert(CRYPTO_CONSTANTS.SALT_LENGTH === 16, "SALT_LENGTH");
	assert(CRYPTO_CONSTANTS.IV_LENGTH === 12, "IV_LENGTH");
	assert(CRYPTO_CONSTANTS.AUTH_TAG_LENGTH === 16, "AUTH_TAG_LENGTH");
	assert(CRYPTO_CONSTANTS.KEY_LENGTH === 32, "KEY_LENGTH");
	assert(CRYPTO_CONSTANTS.VERIFY_PREFIX === "MIZUKI-VERIFY:", "VERIFY_PREFIX");
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
