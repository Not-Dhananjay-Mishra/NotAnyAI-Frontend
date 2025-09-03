import React, { useState } from "react";

export default function Test() {
  // Separate states for SendToDB
  const [embeddingPayload, setEmbeddingPayload] = useState("");
  const [payloadSend, setPayloadSend] = useState("");
  const [collectionSend, setCollectionSend] = useState("");

  // Separate states for Lookup
  const [payloadLookup, setPayloadLookup] = useState("");
  const [collectionLookup, setCollectionLookup] = useState("");

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reusable request function
  const sendRequest = async (endpoint, body) => {
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch(`http://localhost:8000/api/rag/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendToDb = (e) => {
    e.preventDefault();
    sendRequest("sendtodb", {
      EmbeddingPayload: embeddingPayload,
      payload: payloadSend,
      collection: collectionSend,
    });
  };

  const handleLookup = (e) => {
    e.preventDefault();
    sendRequest("lookup", {
      payload: payloadLookup,
      collection: collectionLookup,
    });
  };

  return (
    <div className="min-h-screen flex flex-row items-start justify-center bg-gray-100 p-6 space-x-8">
      {/* Send to DB form */}
      <form
        onSubmit={handleSendToDb}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-semibold">📤 Send to DB</h2>

        <div>
          <label className="block text-gray-700 mb-2">Embedding Payload</label>
          <textarea
            value={embeddingPayload}
            onChange={(e) => setEmbeddingPayload(e.target.value)}
            className="w-full border rounded-lg p-2"
            rows="2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Payload</label>
          <textarea
            value={payloadSend}
            onChange={(e) => setPayloadSend(e.target.value)}
            className="w-full border rounded-lg p-2"
            rows="3"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Collection</label>
          <input
            type="text"
            value={collectionSend}
            onChange={(e) => setCollectionSend(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {loading ? "Sending..." : "Send to DB"}
        </button>
      </form>

      {/* Lookup form */}
      <form
        onSubmit={handleLookup}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-semibold">🔍 Lookup</h2>

        <div>
          <label className="block text-gray-700 mb-2">Payload</label>
          <textarea
            value={payloadLookup}
            onChange={(e) => setPayloadLookup(e.target.value)}
            className="w-full border rounded-lg p-2"
            rows="3"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Collection</label>
          <input
            type="text"
            value={collectionLookup}
            onChange={(e) => setCollectionLookup(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          {loading ? "Looking up..." : "Lookup"}
        </button>
      </form>

      {/* Results */}
      {error && (
        <div className="mt-4 text-red-500 font-medium">❌ {error}</div>
      )}

      {response && (
        <div className="mt-6 bg-green-100 p-4 rounded-lg w-full max-w-md">
          <h2 className="font-bold text-lg mb-2">✅ Response:</h2>
          <pre className="text-sm text-gray-800 whitespace-pre-wrap">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
