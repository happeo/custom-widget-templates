import React, { useState, useCallback } from "react";
import styled from "styled-components";

import { Input, Textarea } from "@happeouikit/form-elements";
import { ButtonPrimary } from "@happeouikit/buttons";
import { alert, success } from "@happeouikit/colors";

import { submitTicket } from "../actions";

const SubmitTicket = ({ widgetApi }) => {
  const [formState, setFormState] = useState({
    subject: "",
    description: "",
  });
  const [isDirty, setIsDirty] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState();
  const [error, setError] = useState();
  const [toast, setShowToast] = useState();

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
      setShowToast(true);
      setFormState({
        subject: "",
        description: "",
      });
    } catch (error) {
      setError(error);
    }
    setIsSubmitting(false);
  }, [formState]);

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {toast && (
        <Toast>
          <label>Ticket created successfully!</label>
          <ButtonPrimary
            style={{ marginTop: 16 }}
            text="Create another one"
            onClick={() => setShowToast(false)}
          />
        </Toast>
      )}
      <Title style={{ marginBottom: "18px" }}>Submit a ticket</Title>

      <ul>
        <li style={{ marginBottom: "18px" }}>
          <Input
            placeholder="ticket subject"
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

const Toast = styled.div`
  position: absolute;
  z-index: 1;
  background-color: #fff;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  label {
    border-radius: 6px;
    background-color: ${success};
    color: #fff;
    padding: 6px;
    padding-bottom: 8px;
    font-size: 16px;
  }
`;

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
