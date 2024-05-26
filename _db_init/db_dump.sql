CREATE TABLE IF NOT EXISTS campaigns (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1024) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS wordlists (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1024) NOT NULL,
    file BLOB NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS captures (
    id BIGINT NOT NULL AUTO_INCREMENT,
    campaign_id BIGINT,
    method VARCHAR(128),
    headers JSON,
    body TEXT,
    r_headers JSON,
    r_body TEXT,
    r_status INT DEFAULT 0,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS fuzz_request (
    id BIGINT NOT NULL AUTO_INCREMENT,
    wordlist_id BIGINT,
    wordlist_index BIGINT DEFAULT -1,
    capture_id BIGINT,
    campaign_id BIGINT,
    method VARCHAR(128),
    headers JSON,
    body TEXT,
    r_headers JSON,
    r_body TEXT,
    r_status INT DEFAULT 0,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
    FOREIGN KEY (capture_id) REFERENCES captures(id) ON DELETE SET NULL,
    FOREIGN KEY (wordlist_id) REFERENCES wordlists(id) ON DELETE SET NULL,
    PRIMARY KEY(id)
);
