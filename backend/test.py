def generate_unique_barcode(number_of_digits, start_digit, save_path, barcode_type):
    import barcode
    from barcode.writer import ImageWriter
    import random

    # Generate random number string
    number = str(start_digit) + ''.join(str(random.randint(0, 9)) for _ in range(number_of_digits - 1))

    # Select barcode type
    if barcode_type == 'upca':
        code = barcode.get('upca', number, writer=ImageWriter())
    elif barcode_type == 'code128':
        code = barcode.get('code128', number, writer=ImageWriter())
    else:
        raise ValueError("Unsupported barcode type")

    # Configure writer to remove text and make bars thicker
    writer_options = {
        'write_text': False,         # ❌ Hide barcode number
        'module_width': 0.6,         # ✅ Bar width (increase for thicker bars)
        'module_height': 30.0,       # ✅ Bar height
        'quiet_zone': 2.0,           # ✅ White space around barcode
        'font_size': 0               # ✅ Disable font
    }

    filename = code.save(save_path, options=writer_options)
    return number, filename

generate_unique_barcode(15, 1, "barcode", "code128")