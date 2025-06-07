export const Typography = ({ children, variant = 'body1', style, ...props }) => {
    const variants = {
        h4: { fontSize: '2rem', fontWeight: 500, margin: 0 },
        h5: { fontSize: '1.5rem', fontWeight: 500, margin: 0 },
        h6: { fontSize: '1.25rem', fontWeight: 500, margin: 0 },
        body1: { fontSize: '1rem', fontWeight: 400, margin: 0 },
        body2: { fontSize: '0.875rem', fontWeight: 400, margin: 0 }
    };

    return <div style={{ ...variants[variant], ...style }} {...props}>{children}</div>;
};