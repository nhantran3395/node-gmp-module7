import ApiError from "./api-error";

class CredentialInvalid extends ApiError {
  constructor() {
    super(200, "Credential is invalid");
    Object.setPrototypeOf(this, CredentialInvalid.prototype);
  }
}

export default CredentialInvalid;
