import React, { useState } from 'react';
import { motion } from "framer-motion";
import {
  AlertTriangle, CheckCircle, ArrowRightCircle,
  Calendar, Shield, LockKeyhole, Info, ChevronLeft, ChevronRight
} from "lucide-react";

const RESULTS_PER_PAGE = 4;

const MotionDiv  = motion.div;
const MotionH3   = motion.h3;
const MotionSpan = motion.span;

function getPaginationClass(active) {
  if (active) {
    return "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary text-white shadow-sm";
  }
  return "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50";
}

function buildPageButtons(totalPages, safePage, onPage) {
  const buttons = [];
  for (let page = 1; page <= totalPages; page++) {
    const isFirst   = page === 1;
    const isLast    = page === totalPages;
    const isCurrent = page === safePage;
    const isNear    = Math.abs(page - safePage) <= 1;
    if (!isFirst && !isLast && !isNear) {
      if (page === 2 || page === totalPages - 1) {
        buttons.push(
          <span key={"ellipsis" + page} className="h-8 w-8 flex items-center justify-center text-xs text-neutral-400">
            ...
          </span>
        );
      }
      continue;
    }
    const cls = getPaginationClass(isCurrent);
    const p = page;
    buttons.push(
      <button key={page} onClick={() => onPage(p)} className={cls}>
        {page}
      </button>
    );
  }
  return buttons;
}

function buildSiteCards(paginatedSites, safePage) {
  const cards = [];
  for (let i = 0; i < paginatedSites.length; i++) {
    const site  = paginatedSites[i];
    const date  = site.date ? site.date : "Unknown";
    const key   = site.name + String(safePage) + String(i);
    const delay = i * 0.07;
    cards.push(
      <MotionDiv
        key={key}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: delay }}
        className="group"
      >
        <div className="p-4 bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between relative z-10">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-red-50 flex-shrink-0">
                  <LockKeyhole className="h-4 w-4 text-red-500" />
                </div>
                <h5 className="font-medium text-primary truncate">{site.name}</h5>
              </div>
              <p className="text-sm text-neutral-600 mt-2 leading-relaxed">{site.description}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 whitespace-nowrap bg-neutral-100 px-3 py-1.5 rounded-full self-start sm:self-auto flex-shrink-0">
              <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Breach: {date}</span>
            </div>
          </div>
        </div>
      </MotionDiv>
    );
  }
  return cards;
}

function EmailBreachResults({ results }) {
  const { email, breachedSites, breachCount, checkedAt } = results;
  const [currentPage, setCurrentPage] = useState(1);

  const isBreached     = breachCount > 0;
  const siteCount      = breachedSites ? breachedSites.length : 0;
  const totalPages     = Math.max(1, Math.ceil(siteCount / RESULTS_PER_PAGE));
  const safePage       = Math.min(currentPage, totalPages);
  const startIndex     = (safePage - 1) * RESULTS_PER_PAGE;
  const endIndex       = Math.min(safePage * RESULTS_PER_PAGE, siteCount);
  const paginatedSites = breachedSites ? breachedSites.slice(startIndex, endIndex) : [];

  const handlePrev  = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext  = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handlePage  = (p) => setCurrentPage(p);
  const handleTips  = () => {
    const el = document.getElementById("tips");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const outerClass = isBreached
    ? "p-4 sm:p-6 rounded-xl relative overflow-hidden bg-gradient-to-r from-red-50 to-red-100 border border-red-200"
    : "p-4 sm:p-6 rounded-xl relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200";

  const iconWrapClass = isBreached
    ? "p-3 rounded-full flex-shrink-0 bg-red-100"
    : "p-3 rounded-full flex-shrink-0 bg-green-100";

  const headingText   = isBreached ? "Email Found in Data Breaches" : "No Breaches Found";
  const summaryText   = isBreached
    ? email + " was found in " + breachCount + " data breach" + (breachCount > 1 ? "es" : "")
    : email + " appears to be safe from known data breaches";
  const checkedText   = "Last checked: " + new Date(checkedAt).toLocaleString();
  const showingText   = "Showing " + (startIndex + 1) + "–" + endIndex + " of " + siteCount + " breaches";

  const siteCards    = buildSiteCards(paginatedSites, safePage);
  const pageButtons  = buildPageButtons(totalPages, safePage, handlePage);

  return (
    <MotionDiv
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.5 }}
      className="mt-8 overflow-hidden"
    >
      <div className={outerClass}>

        <div className="relative z-10">

          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className={iconWrapClass}>
              {isBreached
                ? <AlertTriangle className="h-7 w-7 text-red-500" />
                : <CheckCircle   className="h-7 w-7 text-green-600" />
              }
            </div>
            <div className="min-w-0">
              <MotionH3
                className="text-lg sm:text-xl font-bold text-primary mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {headingText}
              </MotionH3>
              <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-sm sm:text-base text-neutral-700 break-words">
                  {summaryText}
                </p>
                {isBreached && (
                  <p className="text-xs sm:text-sm text-secondary mt-1 font-medium flex items-center gap-1">
                    <Info className="h-3.5 w-3.5 flex-shrink-0" />
                    Your personal data may have been exposed to unauthorized parties
                  </p>
                )}
              </MotionDiv>
            </div>
          </div>

          {/* Breached sites section */}
          {isBreached && (
            <div className="mt-4 space-y-4">

              {/* Heading + count */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                  <h4 className="font-semibold text-primary text-sm sm:text-base">
                    Websites where your data was compromised:
                  </h4>
                </div>
                <span className="text-xs text-neutral-500 font-medium self-start sm:self-auto">
                  {showingText}
                </span>
              </div>

              {/* Site cards — built outside JSX */}
              <div className="space-y-3">
                {siteCards}
              </div>

              {/* Pagination — built outside JSX */}
              {totalPages > 1 && (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs text-neutral-400 order-2 sm:order-1">
                    Page <span className="font-semibold text-neutral-600">{safePage}</span>
                    {" of "}
                    <span className="font-semibold text-neutral-600">{totalPages}</span>
                  </p>
                  <div className="flex items-center gap-1.5 order-1 sm:order-2">
                    <button
                      onClick={handlePrev}
                      disabled={safePage === 1}
                      className="h-8 w-8 rounded-full flex items-center justify-center bg-white border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {pageButtons}
                    <button
                      onClick={handleNext}
                      disabled={safePage === totalPages}
                      className="h-8 w-8 rounded-full flex items-center justify-center bg-white border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Info box */}
              <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-2 p-4 bg-neutral-100 border border-neutral-200 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-neutral-200 rounded-full mt-0.5 flex-shrink-0">
                    <Info className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-medium text-primary mb-1 text-sm">
                      What information might be exposed?
                    </h5>
                    <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                      Breached data commonly includes emails, passwords, usernames, and may include
                      personal information like names, addresses, phone numbers, or even financial
                      data depending on the breach.
                    </p>
                  </div>
                </div>
              </MotionDiv>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-1.5">
              <MotionDiv
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="h-4 w-4 text-primary" />
              </MotionDiv>
              <span className="text-xs sm:text-sm text-neutral-500">{checkedText}</span>
            </div>
            {isBreached && (
              <button
                onClick={handleTips}
                className="text-secondary hover:text-primary inline-flex items-center gap-1 transition-colors duration-300 text-xs sm:text-sm bg-transparent border-0 p-0 cursor-pointer"
              >
                <span>How to protect yourself</span>
                <MotionSpan
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRightCircle className="h-4 w-4" />
                </MotionSpan>
              </button>
            )}
          </div>

        </div>
      </div>
    </MotionDiv>
  );
}

export default EmailBreachResults;