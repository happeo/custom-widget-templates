import React, { useState, useCallback } from "react";
import styled from "styled-components";

import { Input, Textarea } from "@happeouikit/form-elements";
import { ButtonPrimary } from "@happeouikit/buttons";
import { alert } from "@happeouikit/colors";

import { submitTicket } from "../actions";

const SubmitTicket = ({ widgetApi }) => {
  const [formState, setFormState] = useState({
    subject: "",
    description: "",
  });
  const [isDirty, setIsDirty] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState();
  const [error, setError] = useState();

  const handleFieldUpdate = useCallback(
    (name, value, isDirty = true) => {
      setFormState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setIsDirty(isDirty);
    },
    [setFormState, setIsDirty]
  );

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const token = await widgetApi.getJWT();
      await submitTicket(token, {
        ticket: {
          subject: formState.subject,
          comment: { body: formState.description },
        },
      });
    } catch (error) {
      setError(error);
    }
    setIsSubmitting(false);
  }, [formState]);

  return (
    <div style={{ width: "100%" }}>
      <Title style={{ marginBottom: "18px" }}>Submit a ticket</Title>

      <ul>
        <li style={{ marginBottom: "18px" }}>
          <Input
            placeholder="Placeholder"
            label="Subject"
            autoComplete="off"
            required
            value={formState.subject}
            onChange={({ target: { value } }) => {
              handleFieldUpdate("subject", value);
            }}
          />
        </li>

        <li style={{ marginBottom: "18px" }}>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            rows={5}
            placeholder="what's the problem?"
            required
            value={formState.description}
            onChange={({ target: { value } }) => {
              handleFieldUpdate("description", value);
            }}
          />
        </li>

        <li>
          {error && <Error>Something went wrong in submitting ticket.</Error>}
          <ButtonPrimary
            disabled={!isDirty || isSubmitting}
            text="Submit"
            onClick={handleSubmit}
          />
        </li>
      </ul>
    </div>
  );
};

const Error = styled.div`
  color: ${alert};
`;

const Title = styled.h2``;

const FormLabel = styled.label`
  font-weight: 500;
  font-size: 14px;
  margin: 4px 0;
  display: block;
`;

export default SubmitTicket;
