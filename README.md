# Alabama:  By the Numbers API

## Roadmap

### Data

[] Generate coverage report when ran in 'test' mode.
[] Add unemployment API.
[] Add unemployment data processing.
[] Add vaccination API.
[] Add vaccination data processing.

### Authentication

[] Add user management.
[] Add API tokens.

## API Map

- `/api`
  - `/v1`
    - `/geography`
      - `/nation`
      - `/states`
        - `/all`
          - `/info`
	- `/geoid/:geoid`
	- `/usps/:usps`
      - `/counties`
	- `/fips/:fips`
	- `/state/geoid/:geoid/all`
	- `/state/state/:state/all`
	- `/state/usps/:usps/all`
    - `/counties`
      - `/all`
      - `/fips/:fips`
      - `/code/:code`
    - `/weather`
      - `/nws`
      	- `/alert`
          - `/colors`
            - `/all`
