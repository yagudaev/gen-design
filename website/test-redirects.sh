#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Testing VibeFlow Redirects ===${NC}"
echo "Testing HTTP/HTTPS and naked/www domain redirects."
echo

# Function to test a redirect
test_redirect() {
  local test_name="$1"
  local url="$2"
  local expected_location="$3"
  local expected_status="$4"

  echo -e "${YELLOW}Testing: ${test_name}${NC}"
  echo "URL: $url"
  echo "Expected redirect: $expected_location"

  # Get headers and check status/location
  status=$(curl -s -I "$url" | grep -i "^HTTP" | head -n 1 | awk '{print $2}')
  location=$(curl -s -I "$url" | grep -i "^location" | awk '{print $2}' | tr -d '\r')

  echo "Actual status: $status"
  echo "Actual location: $location"

  if [[ "$status" == "$expected_status" && "$location" == "$expected_location" ]]; then
    echo -e "${GREEN}✓ PASS${NC}"
  else
    echo -e "${RED}✗ FAIL${NC}"
    if [[ "$status" != "$expected_status" ]]; then
      echo -e "${RED}  - Status code mismatch: Expected $expected_status, got $status${NC}"
    fi
    if [[ "$location" != "$expected_location" ]]; then
      echo -e "${RED}  - Location mismatch: Expected $expected_location, got $location${NC}"
    fi
  fi
  echo
}

# Core redirect tests

# Test 1: HTTP Naked Domain to HTTPS WWW
test_redirect "HTTP Naked Domain to HTTPS WWW" \
  "http://vibeflow.sh/" \
  "https://www.vibeflow.sh/" \
  "301"

# Test 2: HTTPS Naked Domain to HTTPS WWW
test_redirect "HTTPS Naked Domain to HTTPS WWW" \
  "https://vibeflow.sh/" \
  "https://www.vibeflow.sh/" \
  "301"

# Test 3: HTTP WWW to HTTPS WWW
test_redirect "HTTP WWW to HTTPS WWW" \
  "http://www.vibeflow.sh/" \
  "https://www.vibeflow.sh/" \
  "301"

# Test 3: Path Preservation for a static page
test_redirect "Path Preservation (Static page)" \
  "http://vibeflow.sh/terms" \
  "https://www.vibeflow.sh/terms" \
  "301"

# Test 4: Final Destination (HTTPS WWW should not redirect)
final_status=$(curl -s -I "https://www.vibeflow.sh/" | grep -i "^HTTP" | head -n 1 | awk '{print $2}')
echo -e "${YELLOW}Testing: Final Destination (HTTPS WWW)${NC}"
echo "URL: https://www.vibeflow.sh/"
echo "Expected status: 200"
echo "Actual status: $final_status"

if [[ "$final_status" == "200" ]]; then
  echo -e "${GREEN}✓ PASS${NC}"
else
  echo -e "${RED}✗ FAIL - Final destination redirected or errored${NC}"
fi

echo
echo -e "${YELLOW}=== Test Summary ===${NC}"
echo "Tests show if redirects are working correctly."
