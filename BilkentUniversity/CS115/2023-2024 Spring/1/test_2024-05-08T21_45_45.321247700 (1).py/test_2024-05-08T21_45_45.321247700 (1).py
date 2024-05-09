```python
import pytest
from io import StringIO
import sys
import temp

@pytest.mark.parametrize("input_str, expected_output", [
    ("Ali\nSu\nAyşe\n", "Ayşe 's name is the longest\n"),
    ("Berk\nCan\nDoğa\n", "Berk 's name is the longest, but there is a tie!\n"),
    ("Eren\nEce\nAli\n", "Eren 's name is the longest\n"),
    ("Ali\nEce\nNil\n", "Ali 's name is the longest, but there is a tie!\n")
])
def test_longest_name(input_str, expected_output, monkeypatch, capsys):
    monkeypatch.setattr("sys.stdin", StringIO(input_str))
    
    temp.main()
    
    captured = capsys.readouterr()
    assert captured.out == expected_output
```  