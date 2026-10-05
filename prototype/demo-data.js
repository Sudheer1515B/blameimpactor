window.SIH_DEMO = {
  "status": "PASS_TEST_ONLY_WORKING_PROTOTYPE",
  "production_release_enabled": false,
  "platform": {
    "system": "Darwin",
    "release": "27.0.0",
    "machine": "arm64"
  },
  "chain_id": "32668a05ef84598cec3887b9162754f79950a890ed03fdbd5cfe2c2f8d0cb83b",
  "document_id": "bd0261c1e8a99fba1055066dc05d64ab",
  "package_id": "f4f32da0bb8754689d5d6fddd0675b52",
  "content_ciphertexts": 1,
  "recipient_envelopes": 2,
  "carrier": 1001,
  "approval_mode": "EXPLICIT_SYNTHETIC_DEMO_ALLOW_NOT_TRUSTED_HUMAN_UI",
  "sessions": [
    {
      "recipient_id": "00000000000000000000000000000007",
      "session_id": "13a13d8fd24d901ed70c3f20f1c3a0c0",
      "output_sha384": "76059c297b83dd2c821e8a673253476b109fd0ae3a1d7d3b73990561f4b5b5c3ad053a15931b65240b9bbb32f4c2ae19",
      "output_bytes": 649293,
      "session_height": 1,
      "claim_height": 2,
      "durable_ack_validators": [
        1,
        2,
        3,
        4
      ],
      "consumed_before_native_tls_write": true,
      "second_stream_refused": true,
      "durable_replay": {
        "refused": true,
        "authority": "GO_SQLITE_UNIQUE_TRANSFER",
        "bytes_written": 0,
        "consumed_count": 1,
        "worker_finished": {
          "consumed": false,
          "consumed_count": 1,
          "error": "sqlite19: UNIQUE constraint failed: consumes.transfer",
          "event": "finished",
          "success": false
        }
      },
      "journal_stage": "SESSION_SUBMITTED",
      "journal_requires_reconciliation": true
    },
    {
      "recipient_id": "00000000000000000000000000000008",
      "session_id": "6ee19b15be4da1b5f41e684b02374d02",
      "output_sha384": "4bf627cf75f188f808e36920918b748050bf9df2eaebeabe37d222dc6b85f51f5928d716e4ac334a777fd1f7ce14494e",
      "output_bytes": 651251,
      "session_height": 3,
      "claim_height": 4,
      "durable_ack_validators": [
        1,
        2,
        3,
        4
      ],
      "consumed_before_native_tls_write": true,
      "second_stream_refused": true,
      "durable_replay": {
        "refused": true,
        "authority": "GO_SQLITE_UNIQUE_TRANSFER",
        "bytes_written": 0,
        "consumed_count": 2,
        "worker_finished": {
          "consumed": false,
          "consumed_count": 2,
          "error": "sqlite19: UNIQUE constraint failed: consumes.transfer",
          "event": "finished",
          "success": false
        }
      },
      "journal_stage": "SESSION_SUBMITTED",
      "journal_requires_reconciliation": true
    }
  ],
  "investigations": [
    {
      "verdict": "EXACT_AUTHENTICATED_COPY",
      "session_id": "13a13d8fd24d901ed70c3f20f1c3a0c0",
      "recipient_id": "00000000000000000000000000000007",
      "human_leaker": "NOT_ESTABLISHED",
      "delivery": "NOT_ESTABLISHED"
    },
    {
      "verdict": "EXACT_AUTHENTICATED_COPY",
      "session_id": "6ee19b15be4da1b5f41e684b02374d02",
      "recipient_id": "00000000000000000000000000000008",
      "human_leaker": "NOT_ESTABLISHED",
      "delivery": "NOT_ESTABLISHED"
    }
  ],
  "rewritten_investigation": {
    "verdict": "RENDER_EQUIVALENT_AUTHENTICATED_COPY",
    "session_id": "13a13d8fd24d901ed70c3f20f1c3a0c0",
    "recipient_id": "00000000000000000000000000000007",
    "human_leaker": "NOT_ESTABLISHED",
    "delivery": "NOT_ESTABLISHED"
  },
  "mismatched_evidence_investigation": {
    "verdict": "INCONCLUSIVE",
    "session_id": null,
    "recipient_id": null,
    "human_leaker": "NOT_ESTABLISHED",
    "delivery": "NOT_ESTABLISHED"
  },
  "consumed_transfers": 2,
  "limits": {
    "prepared_bytes": 1048576,
    "pages": 1,
    "genesis_epoch": 0,
    "storage_unlock": "EPHEMERAL_PROCESS_KEYS_NOT_RESTARTABLE",
    "independent_admin": false
  }
};
