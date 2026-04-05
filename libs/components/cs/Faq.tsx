import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { Stack, Typography, Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useQuery } from "@apollo/client";
import { GET_FAQS } from "../../../apollo/user/query";
import { Faq as FaqType } from "../../types/cs/faq";
import { FaqCategory } from "../../enums/faq.enum";

const CATEGORIES = [
  { labelKey: "All", value: "ALL" },
  { labelKey: "Perfume", value: FaqCategory.PERFUME },
  { labelKey: "Payment", value: FaqCategory.PAYMENT },
  { labelKey: "Delivery", value: FaqCategory.DELIVERY },
  { labelKey: "Membership", value: FaqCategory.MEMBERSHIP },
  { labelKey: "Other", value: FaqCategory.OTHER },
];

const FaqComponent = () => {
  const { t } = useTranslation("common");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [expanded, setExpanded] = useState<string | false>(false);

  /** APOLLO REQUESTS **/
  const { data } = useQuery(GET_FAQS);
  const faqs: FaqType[] = data?.getFaqs?.list ?? [];

  const filtered =
    activeCategory === "ALL"
      ? faqs
      : faqs.filter((f) => f.faqCategory === activeCategory);

  /** HANDLERS **/
  const handleAccordion = (id: string) => {
    setExpanded((prev) => (prev === id ? false : id));
  };

  return (
    <Stack className="faq-content">
      {/* Category tabs */}
      <div className="tabs-section">
        <div className="tabs-wrap">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              className={`tab-pill ${activeCategory === cat.value ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.value)}
              disableRipple
            >
              {t(cat.labelKey)}
            </Button>
          ))}
        </div>
      </div>

      {/* Accordion list */}
      <Stack className="faq-list">
        {filtered.length === 0 ? (
          <Stack className="no-data">
            <Typography>{t("No FAQs found.")}</Typography>
          </Stack>
        ) : (
          filtered.map((faq) => (
            <Accordion
              key={faq._id}
              expanded={expanded === faq._id}
              onChange={() => handleAccordion(faq._id)}
              className="faq-accordion"
              disableGutters
              elevation={0}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className="expand-icon" />}
                className="faq-summary"
              >
                <Stack className="summary-inner">
                  <span className="faq-badge">{faq.faqCategory}</span>
                  <Typography className="faq-question">{faq.faqQuestion}</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails className="faq-details">
                <Typography className="faq-answer">{faq.faqAnswer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Stack>
    </Stack>
  );
};

export default FaqComponent;
