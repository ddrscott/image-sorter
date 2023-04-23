elastic_token:
	curl -X POST -k -u "${ELASTIC_USER}:${ELASTIC_PASS}" "${ELASTIC_URL}/_security/api_key?pretty" -H 'Content-Type: application/json' \
		-d'{"name": "image-sorter-key", "role_descriptors": { "reader": { "cluster": ["all"], "index": [ { "names": ["*"], "privileges": ["read", "write"] } ] } } }'
