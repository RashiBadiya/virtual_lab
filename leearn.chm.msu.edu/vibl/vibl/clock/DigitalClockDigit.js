function DigitalClockDigit(lib) {
    const base = new lib.msuvudatcomponentsclockDigitalClockDigit();
    base.setDigit = (digitValue) => {
        base.digit_txt.text = digitValue;
        if (digitValue === ':') {
            base.digit_txt.y = -16;
        }
    }
    ;
    return base;
}
